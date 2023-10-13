import { Injectable, NotFoundException } from '@nestjs/common';
import { createWriteStream } from 'fs';
import * as PDFDocument from 'pdfkit';
import { CompanyInvoiceDataDto } from '../company/dto/company-invoice-data.dto';
import { CompanyCreateInvoiceDto } from '../company/dto/company-create-invoice.dto';
import { Repository } from 'typeorm';
import { CompanyProfile } from '../company/entity/CompanyProfile.entity';
import { MissionService } from '../mission/mission.service';
import { StudentService } from '../student/student.service';
import { CompanyService } from '../company/company.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Document } from '../documents/entity/document.entity';
import { FileService } from '../filesystem/file.service';
import { createReadStream } from 'fs';
import { DocumentTypeEnum } from '../documents/enum/document-type.enum';
import { DocumentUserEnum } from '../documents/enum/document-user.enum';

interface Row {
  [key: string]: string | number;
}

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(CompanyProfile)
    private readonly companyProfileRepository: Repository<CompanyProfile>,
    private readonly missionService: MissionService,
    private readonly studentService: StudentService,
    @InjectRepository(Document)
    private readonly DocumentAdminRepository: Repository<Document>,
    private readonly fileService: FileService,
    //private readonly companyService: CompanyService,
  ) {}

  async generateInvoice(email: string, body: CompanyCreateInvoiceDto) {
    const companyProfile = await this.companyProfileRepository.findOne({
      where: { email: email },
    });
    if (!companyProfile) throw new Error(`Could not find company profile`);
    const companyName = companyProfile.name;
    const address = companyProfile.address;
    const location = companyProfile.location;
    const phoneNumber = companyProfile.phone;
    const headerFields = body.headerFields;
    const rows = body.rows;
    const amount = body.amount;
    const mission = await this.missionService.findMissionById(body.missionId);
    if (!mission) throw new NotFoundException(`Could not find mission`);
    const studentProfile =
      await this.studentService.findStudentProfileByStudentId(body.studentId);
    if (!studentProfile)
      throw new NotFoundException(`Could not find student profile`);
    const Data = new CompanyInvoiceDataDto();
    Data.companyName = companyName ? companyName : '';
    Data.address = address ? address : '';
    Data.location = location ? location : '';
    Data.phoneNumber = phoneNumber ? phoneNumber : '';
    Data.headerFields = headerFields;
    Data.rows = rows;
    Data.amount = amount;
    Data.missionName = mission.name ? mission.name : '';
    Data.invoiceNumber = mission.id;
    Data.studentName = studentProfile.firstName + ' ' + studentProfile.lastName;
    Data.studentLocation = studentProfile.location ? studentProfile.location : '';

    return this.generatePdf('invoice.pdf', Data, companyProfile);
  }

  async generatePdf(
    filePath: string,
    data: CompanyInvoiceDataDto,
    companyProfile : CompanyProfile,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const pdf = new PDFDocument();
      const stream = createWriteStream(filePath);
      const currentDate: Date = new Date();

      const day: number = currentDate.getDate();
      const month: number = currentDate.getMonth() + 1;
      const year: number = currentDate.getFullYear();
      const hour: number = currentDate.getHours();
      const minute: number = currentDate.getMinutes();

      const formattedDate: string = `${day}/${month}/${year} ${hour}:${minute}`;

      pdf.pipe(stream);

      pdf.rect(0, 0, 612, 60).fill('#005275');
      //pdf.image('assets/linker_logo.png', 0, 10, { width: 150 });

      const headerText = data.companyName;
      const headerWidth = pdf.widthOfString(headerText);
      const headerX = (pdf.page.width - headerWidth) / 2;
      pdf.font('Helvetica-Bold').fontSize(16).text(headerText, 50, 90);

      // Add companyName
      const companyName = data.companyName;
      const companyNameWidth = pdf.widthOfString(companyName);
      const companyNameX = (pdf.page.width - companyNameWidth) / 2 + 220;
      pdf.font('Helvetica').fontSize(10).text(companyName, companyNameX, 70);

      // Add address
      const address = data.address;
      const addressWidth = pdf.widthOfString(address);
      const addressX = (pdf.page.width - addressWidth) / 2 + 200;
      pdf.font('Helvetica').fontSize(10).text(address, addressX, 90);

      // Add location
      const location = data.location;
      const locationWidth = pdf.widthOfString(location);
      const locationX = (pdf.page.width - locationWidth) / 2 + 200;
      pdf.font('Helvetica').fontSize(10).text(location, locationX, 110);

      // Add phoneNumber
      const phoneNumber = data.phoneNumber;
      const phoneNumberWidth = pdf.widthOfString(phoneNumber);
      const phoneNumberX = (pdf.page.width - phoneNumberWidth) / 2 + 200;
      pdf.font('Helvetica').fontSize(10).text(phoneNumber, phoneNumberX, 130);

      pdf.font('Helvetica-Bold').fontSize(16).text('Facture', 50, 200);
      pdf.font('Helvetica-Bold').fontSize(14).text(data.missionName, 50, 230);
      pdf.font('Helvetica').fontSize(10).text('Numéro de facture :', 50, 260);
      pdf.font('Helvetica').fontSize(10).text('16', 150, 260);

      pdf.font('Helvetica-Bold').fontSize(16).text('Étudiant', 460, 230);
      pdf.font('Helvetica').fontSize(10).text(data.studentName, 460, 260);
      pdf.font('Helvetica').fontSize(10).text(data.studentLocation, 460, 280);

      pdf.font('Helvetica').fontSize(10).text('Date de facture:', 50, 280);
      pdf.font('Helvetica').fontSize(10).text(formattedDate, 130, 280);

      pdf.font('Helvetica').fontSize(10).text('Montant :', 50, 300);
      pdf
        .font('Helvetica')
        .fontSize(10)
        .text(data.amount + ' €', 100, 300);

      // Add footer
      pdf.rect(0, 750, 612, 60).fill('#005275');
      //pdf.image('assets/linker_logo.png', 0, 750, { width: 150 });

      // Define column headers
      const headers = ['Task', 'Description', 'Cost'];
      let tableYPos = 360;

      // Add headers
      headers.forEach((header, index) => {
        pdf
          .font('Helvetica-Bold')
          .fontSize(12)
          .text(header, 50 + index * 150, tableYPos);
      });

      pdf
        .fillColor('#005275') // Blue color for the title row
        .rect(50, tableYPos, 550, 20)
        .fill();

      // Add headers with colored background and lines
      data.headerFields.forEach((header, index) => {
        pdf
          .font('Helvetica-Bold')
          .fontSize(12)
          .fillColor('#FFFFFF') // White color for text in the title row
          .text(
            header,
            50 + (index * 550) / data.headerFields.length,
            tableYPos + 5,
          );
      });

      // Increment Y position for content
      tableYPos += 20;

      // Add content rows with colored background and lines
      data.rows.forEach((row, i) => {
        const fillColor = i % 2 === 0 ? '#F0F0F0' : '#FFFFFF'; // Alternate row colors
        pdf.fillColor(fillColor).rect(50, tableYPos, 550, 20).fill();

        let columnX = 50;

        data.headerFields.forEach((field) => {
          pdf
            .font('Helvetica')
            .fontSize(8)
            .fillColor('#000000')
            .text(String(row[field]), columnX, tableYPos + 5);
          columnX += 550 / data.headerFields.length;
        });

        tableYPos += 20;
      });

      pdf.fillColor('#005275').rect(50, tableYPos, 550, 20).fill();
      pdf
        .font('Helvetica-Bold')
        .fontSize(12)
        .fillColor('#FFFFFF')
        .text('Total', 50, tableYPos + 5);
      pdf
        .font('Helvetica-Bold')
        .fontSize(12)
        .fillColor('#FFFFFF')
        .text(data.amount + ' €', 460, tableYPos + 5);

      pdf.on('end', () => {
        console.log('PDF generated successfully.');
        const fileStream = createReadStream(filePath);
        this.fileService.storeFileStream(fileStream, 'invoice.pdf').then(async (file: string) => {
          const filepath: string = file;
          const doc = new Document();
          doc.documentPath = filepath;
          doc.documentType = DocumentTypeEnum.INVOICE;
          doc.documentUser = DocumentUserEnum.COMPANY;
          doc.userId = companyProfile.companyId;
          this.DocumentAdminRepository.save(doc);
        }
        );

        resolve();
      });

      pdf.on('error', (error) => {
        console.error('Error generating PDF:', error);
        reject(error);
      });

      pdf.end();
    });
  }

  async findInvoiceById(id: number): Promise<Document> {
    return this.DocumentAdminRepository.findOne({ where: { id } });
  }

  async downloadInvoice(id: number, res: any): Promise<any> {
    try {
      const document = await this.findInvoiceById(id);
  
      if (!document) {
        // If document is not found, send a 404 response
        return res.status(404).json({ message: 'Document not found' });
      }
  
      const path = document.documentPath.replace(
        process.env.BASE_URL + '/public/',
        '',
      );
  
      return this.fileService.getFile(path, res);
    } catch (error) {
      // Handle any other errors
      console.error('An error occurred:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  
  async getInvoices(email: string): Promise<any> {
    const companyProfile = await this.companyProfileRepository.findOne({
      where: { email: email },
    });
    if (!companyProfile) throw new Error(`Could not find company profile`);
    const documentsQuery = this.DocumentAdminRepository.createQueryBuilder(
      'document',
    );
    documentsQuery.where('document.documentUser = :documentUser', {
      documentUser: DocumentUserEnum.COMPANY,
    });
    documentsQuery.andWhere('document.userId = :userId', {
      userId: companyProfile.companyId,
    });
    documentsQuery.andWhere('document.documentType = :documentType', {
      documentType: DocumentTypeEnum.INVOICE,
    });
    const documents = await documentsQuery.getMany();
    return documents;
  }

  async deleteInvoice(id: number): Promise<any> {
    const document = await this.findInvoiceById(id);
    if (!document) throw new NotFoundException(`Could not find document`);
    await this.fileService.deleteFile(document.documentPath);
    await this.DocumentAdminRepository.delete(id);
    return 'Document deleted';
  }
}