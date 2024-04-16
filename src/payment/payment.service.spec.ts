import { Test, TestingModule } from '@nestjs/testing';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entity/payment.entity';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { Mission } from '../mission/entity/mission.entity';
import { CompanyUser } from '../company/entity/companyUser.entity';
import { PaymentStatus } from './enum/payment.status.enum';
import { MissionStatus } from '../mission/enum/mission-status.enum';




describe('PaymentService', () => {
    let service: PaymentService;
    let controller: PaymentController;
    
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
        imports: [
            PassportModule.register({ defaultStrategy: 'jwt' }),
            JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '60m' },
            }),
        ],
        controllers: [PaymentController],
        providers: [
            PaymentService,
            {
            provide: getRepositoryToken(Payment),
            useClass: Repository
            },
            {
            provide: getRepositoryToken(Mission),
            useClass: Repository
            },
            {
            provide: getRepositoryToken(CompanyUser),
            useClass: Repository
            },
            {
            provide: PaymentService,
            useValue: {
                createProductAndCheckoutSession: jest.fn(),
                paymentSuccess: jest.fn(),
                getPayment: jest.fn(),
            },
            }
        
        ],
        exports: [PaymentService],
        }).compile();

        controller = module.get<PaymentController>(PaymentController);
        service = module.get<PaymentService>(PaymentService);

    }
    );

    describe('createProductAndCheckoutSession', () => {
        it('should create product and checkout session', async () => {
        const payment : Payment = {
            id: 1,
            missionId: 1,
            sessionId: 'test',
            status: PaymentStatus.WAITING,
            email: 'test@gmail.com',
            createdAt: new Date(),
            priceId: 'test',
            productId: 'test',
            companyId: 1,
            sessionUrl: 'test',
        };

        const mission : Mission = {
            name: 'Name',
            description: 'Desc',
            startOfMission: null,
            endOfMission: null,
            amount: 100,
            id: 1,
            createdAt: new Date(),
            groupId: null,
            status: MissionStatus.PENDING,
            companyId: 1,
            skills: '',
            comments: null,
            isNoted: false,
          };

        const req = {
            user: {
                email: 'test@gmail.com',
            },
        };

        jest.spyOn(service, 'createProductAndCheckoutSession').mockResolvedValue(payment);

        const res = await controller.createProductAndCheckoutSession('1', req);

        expect(service.createProductAndCheckoutSession).toHaveBeenCalledWith('1', req);
        expect(payment).toEqual(res);
        }
        );
    });

    describe('paymentSuccess', () => {
        it('should return payment success', async () => {
        const payment : Payment = {
            id: 1,
            missionId: 1,
            sessionId: 'test',
            status: PaymentStatus.WAITING,
            email: 'test@gmail.com',
            createdAt: new Date(),
            priceId: 'test',
            productId: 'test',
            companyId: 1,
            sessionUrl: 'test',
        };

        jest.spyOn(service, 'paymentSuccess').mockResolvedValue('Payment successful');

        const res = await controller.paymentSuccess('test', '1');

        expect(service.paymentSuccess).toHaveBeenCalledWith('test', '1');

        expect('Payment successful').toEqual(res);
        }
        );
    }
    );

    describe('getPayments', () => {
        it('should get payments', async () => {
        const payment : Payment = {
            id: 1,
            missionId: 1,
            sessionId: 'test',
            status: PaymentStatus.WAITING,
            email: 'test@gmail.com',
            createdAt: new Date(),
            priceId: 'test',
            productId: 'test',
            companyId: 1,
            sessionUrl: 'test',
        };

        const req = {
            user: {
                email: 'test@gmail.com',
            },
        };

        jest.spyOn(service, 'getPayment').mockResolvedValue(payment);

        const res = await controller.getPayments('1', req);

        expect(service.getPayment).toHaveBeenCalledWith('1', req);

        expect(payment).toEqual(res);
    });
    });
}
);

