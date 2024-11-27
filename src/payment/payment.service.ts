import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { MissionService } from '../mission/mission.service';
import { Payment } from './entity/payment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentStatus } from './enum/payment.status.enum';
import { CompanyService } from '../company/company.service';
import { MissionStatus } from '../mission/enum/mission-status.enum';
import { StudentPayment } from './entity/student-payment.entity';
import { StudentService } from '../student/student.service';
import { StudentPaymentResponseDto } from './dto/student-payment-response.dto';
import { StudentPaymentStatus } from './enum/student-payment.status.enum';
import { InvoiceService } from '../invoice/invoice.service';
import { CompanyCreateInvoiceDto } from '../company/dto/company-create-invoice.dto';
import Stripe from 'stripe';
import { LinkerInvoiceCompanyDto } from '../invoice/dto/linker-invoice-company.dto';

@Injectable()
export class PaymentService {
  constructor(
    @Inject(forwardRef(() => MissionService))
    private readonly missionService: MissionService,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    private readonly companyService: CompanyService,
    @InjectRepository(StudentPayment)
    private readonly studentPaymentRepository: Repository<StudentPayment>,
    private readonly studentService: StudentService,
    @Inject(forwardRef(() => InvoiceService))
    private readonly invoiceService: InvoiceService,
  ) {}

  async createProductAndCheckoutSession(missionId: string, req: any) {
    if (!missionId) {
      throw new NotFoundException('Mission ID not found');
    }

    const Checkout = await this.createPaymentRow(parseInt(missionId), req);
    return Checkout;
  }

  async paymentSuccess(sessionId: string, missionId: string) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      throw new NotFoundException('Payment not successful');
    }

    const payment = await this.paymentRepository.findOne({
      where: {
        missionId: parseInt(missionId),
        sessionId: sessionId,
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    const mission = await this.missionService.findMissionById(
      parseInt(missionId),
    );
    if (!mission) {
      throw new NotFoundException('Mission not found');
    }
    console.log('mission', mission);

    const company = await this.companyService.findCompanyById(
      mission.companyId,
    );

    const missionDetails = await this.missionService.getMissionDetailsCompanyV2(
      mission.id,
      company.email,
    );

    if (!mission.groupId) {
      throw new NotFoundException('Mission is not a group mission');
    }

    console.log('missionDetails', missionDetails);

    const studentIdsWithTasks = new Set(
      missionDetails.missionTaskArray
        .filter((taskItem) => taskItem.studentProfile !== null)
        .map((taskItem) => taskItem.studentProfile.studentId),
    );

    const studentsWithTasks = missionDetails.groupStudents.filter(
      (groupStudent) =>
        studentIdsWithTasks.has(groupStudent.studentProfile.studentId),
    );

    console.log('studentsWithTasks', studentsWithTasks);

    for (const groupStudent of studentsWithTasks) {
      const studentProfile = groupStudent.studentProfile;
      console.log('studentProfile', studentProfile);

      const studentMissionTasks = missionDetails.missionTaskArray.filter(
        (taskItem) =>
          taskItem.studentProfile?.studentId === studentProfile.studentId,
      );
      console.log('studentMissionTasks', studentMissionTasks);

      const invoiceData = new CompanyCreateInvoiceDto();
      invoiceData.missionId = mission.id;
      invoiceData.studentId = studentProfile.studentId;

      invoiceData.amount = studentMissionTasks.reduce(
        (total, taskItem) => total + taskItem.missionTask.amount,
        0,
      );
      console.log('invoiceData', invoiceData);

      invoiceData.headerFields = ['Tache', 'Description', 'Montant'];
      invoiceData.rows = studentMissionTasks.map((taskItem) => ({
        Tache: taskItem.missionTask.name,
        Description: taskItem.missionTask.description,
        Montant: taskItem.missionTask.amount,
      }));

      await this.invoiceService.generateInvoice(company.email, invoiceData);
    }

    const companyInvoiceData = new LinkerInvoiceCompanyDto();
    companyInvoiceData.missionId = mission.id;
    companyInvoiceData.companyId = company.id;
    companyInvoiceData.companyEmail = company.email;

    companyInvoiceData.amount = missionDetails.missionTaskArray.reduce(
      (total, taskItem) => total + taskItem.missionTask.amount,
      0,
    );

    companyInvoiceData.headerFields = [
      'Tache',
      'Etudiant',
      'Description',
      'Montant',
    ];
    companyInvoiceData.rows = missionDetails.missionTaskArray.map(
      (taskItem) => ({
        Tache: taskItem.missionTask.name,
        Etudiant: taskItem.studentProfile
          ? `${taskItem.studentProfile.firstName} ${taskItem.studentProfile.lastName}`
          : 'Non assigné',
        Description: taskItem.missionTask.description,
        Montant: taskItem.missionTask.amount,
      }),
    );

    await this.invoiceService.generateInvoiceForCompany(companyInvoiceData);

    mission.status = MissionStatus.PROVISIONED;
    payment.status = PaymentStatus.PAID;
    payment.email = session.customer_details.email;

    await this.paymentRepository.save(payment);
    await this.missionService.saveMission(mission);

    return 'Payment successful and invoices generated';
  }

  async createPaymentRow(missionId: number, req: any) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const mission = await this.missionService.findMissionById(missionId);

    if (!mission) {
      throw new NotFoundException('Mission not found');
    }

    const missionTasks = await this.missionService.getMissionTasks(
      missionId,
      req,
    );
    if (missionTasks.length === 0) {
      throw new NotFoundException('Mission has no tasks');
    }

    const company = await this.companyService.findOne(req.user.email);
    if (!company) {
      throw new NotFoundException('Company not found');
    }

    if (company.id !== mission.companyId) {
      throw new NotFoundException('Company does not own this mission');
    }

    try {
      const actualPayment = await this.paymentRepository.findOne({
        where: {
          missionId: missionId,
        },
      });

      if (actualPayment) {
        return actualPayment;
      }

      const product = await stripe.products.create({
        name: mission.name,
      });

      const missionPrice = missionTasks.reduce(
        (acc, task) => acc + task.amount,
        0,
      );

      const price = await stripe.prices.create({
        unit_amount: missionPrice * 100,
        currency: 'eur',
        product: product.id,
      });

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: price.id,
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `http://${process.env.BASE_URL}/api/payment/checkout/session?session_id={CHECKOUT_SESSION_ID}&mission_id=${missionId}`,
        cancel_url: `http://${process.env.BASE_URL}/cancel`,
      });

      const payment = new Payment();
      payment.missionId = missionId;
      payment.companyId = mission.companyId;
      payment.productId = product.id;
      payment.priceId = price.id;
      payment.sessionId = session.id;
      payment.sessionUrl = session.url;

      await this.paymentRepository.save(payment);

      return payment;
    } catch (error) {
      console.error('Error creating product and checkout session:', error);
      throw error;
    }
  }

  async getPayment(missionId: string, req: any) {
    const mission = await this.missionService.findMissionById(
      parseInt(missionId),
    );
    if (!mission) {
      throw new NotFoundException('Mission not found');
    }

    const company = await this.companyService.findOne(req.user.email);
    if (!company) {
      throw new NotFoundException('Company not found');
    }

    if (company.id !== mission.companyId) {
      throw new NotFoundException('Company does not own this mission');
    }

    const payment = await this.paymentRepository.findOne({
      where: {
        missionId: parseInt(missionId),
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  async createStudentPayment(
    missionId: number,
    studentId: number,
    amount: number,
  ) {
    const studentPayment = new StudentPayment();
    studentPayment.missionId = missionId;
    studentPayment.studentId = studentId;
    studentPayment.amount = amount;

    await this.studentPaymentRepository.save(studentPayment);
  }

  async getStudentPayment(req: any): Promise<StudentPaymentResponseDto[]> {
    const student = await this.studentService.findOneByEmail(req.user.email);
    const studentPayments = await this.studentPaymentRepository.find({
      where: {
        studentId: student.id,
      },
    });

    const studentPaymentResponseDtos = studentPayments.map(
      async (studentPayment) => {
        const mission = await this.missionService.findMissionById(
          studentPayment.missionId,
        );
        if (!mission) {
          throw new NotFoundException('Mission not found');
        }
        return {
          id: studentPayment.id,
          missionName: mission.name,
          status: studentPayment.status,
          amount: studentPayment.amount,
        };
      },
    );

    return Promise.all(studentPaymentResponseDtos);
  }

  async getStudentPaymentById(studentPaymentId: number, req: any) {
    const studentPayment = await this.studentPaymentRepository.findOne({
      where: {
        id: studentPaymentId,
      },
    });

    if (!studentPayment) {
      throw new NotFoundException('Student payment not found');
    }

    const student = await this.studentService.findOneByEmail(req.user.email);
    if (student.id !== studentPayment.studentId) {
      throw new NotFoundException('Student does not own this payment');
    }

    const mission = await this.missionService.findMissionById(
      studentPayment.missionId,
    );
    if (!mission) {
      throw new NotFoundException('Mission not found');
    }

    return {
      id: studentPayment.id,
      missionName: mission.name,
      status: studentPayment.status,
      amount: studentPayment.amount,
    };
  }

  async receiveStudentPayment(studentPaymentId: number, req: any) {
    const studentPayment = await this.studentPaymentRepository.findOne({
      where: {
        id: studentPaymentId,
      },
    });

    if (!studentPayment) {
      throw new NotFoundException('Student payment not found');
    }

    const student = await this.studentService.findOneByEmail(req.user.email);
    if (student.id !== studentPayment.studentId) {
      throw new NotFoundException('Student does not own this payment');
    }

    studentPayment.status = StudentPaymentStatus.WAITING;
    await this.studentPaymentRepository.save(studentPayment);
  }
}
