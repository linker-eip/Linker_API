import { Injectable } from '@nestjs/common';
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

interface Row {
  [key: string]: string | number;
}

@Injectable()
export class PdfService {
  constructor(
    @InjectRepository(CompanyProfile)
    private readonly companyProfileRepository: Repository<CompanyProfile>,
    private readonly missionService: MissionService,
    private readonly studentService: StudentService,
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
    const studentProfile =
      await this.studentService.findStudentProfileByStudentId(body.studentId);
    const Data = new CompanyInvoiceDataDto();
    Data.companyName = companyName;
    Data.address = address;
    Data.location = location;
    Data.phoneNumber = phoneNumber;
    Data.headerFields = headerFields;
    Data.rows = rows;
    Data.amount = amount;
    Data.missionName = mission.name;
    Data.invoiceNumber = mission.id;
    Data.studentName = studentProfile.firstName + ' ' + studentProfile.lastName;
    Data.studentLocation = studentProfile.location;

    return this.generatePdf('output.pdf', Data);
  }

  async generatePdf(
    filePath: string,
    data: CompanyInvoiceDataDto,
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
      pdf.image('assets/linker_logo.png', 0, 10, { width: 150 });

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
      pdf.rect(0, 700, 612, 60).fill('#005275');
      pdf.image('assets/linker_logo.png', 0, 700, { width: 150 });

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
        resolve();
      });

      pdf.on('error', (error) => {
        console.error('Error generating PDF:', error);
        reject(error);
      });

      pdf.end();
    });
  }
}

/*
  generatePdf(filePath: string, data : CompanyInvoiceDataDto): Promise<void> {
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
      const headerFields = ['zz', 'Description', 'Cost', 'Quantity', 'Total'];
      const rows = [
        {
          zz: 'Task 1',
          Description: 'Description for Task 1',
          Cost: 100,
          Quantity: 2,
          Total: 200,
        },
        {
          zz: 'Task 2',
          Description: 'Description for Task 2',
          Cost: 150,
          Quantity: 1,
          Total: 150,
        },
        {
          zz: 'Task 3',
          Description: 'Description for Task 3',
          Cost: 120,
          Quantity: 3,
          Total: 360,
        },
      ];

      pdf.pipe(stream);

      // Add logo
      pdf.image(
        'linker_external/public/1695044493024-Capture d’écran 2023-09-18 à 11.06.00.png',
        50,
        50,
        { width: 100 },
      );

      // Add header
      const headerText = 'Company';
      const headerWidth = pdf.widthOfString(headerText);
      const headerX = (pdf.page.width - headerWidth) / 2;
      pdf.font('Helvetica-Bold').fontSize(16).text(headerText, 150, 70);

      // Add companyName
      const companyName = 'companyName';
      const companyNameWidth = pdf.widthOfString(companyName);
      const companyNameX = (pdf.page.width - companyNameWidth) / 2 + 200;
      pdf.font('Helvetica').fontSize(10).text(companyName, companyNameX, 70);

      // Add address
      const address = 'adresse';
      const addressWidth = pdf.widthOfString(address);
      const addressX = (pdf.page.width - addressWidth) / 2 + 200;
      pdf.font('Helvetica').fontSize(10).text(address, addressX, 90);

      // Add location
      const location = 'location';
      const locationWidth = pdf.widthOfString(location);
      const locationX = (pdf.page.width - locationWidth) / 2 + 200;
      pdf.font('Helvetica').fontSize(10).text(location, locationX, 110);

      // Add phoneNumber
      const phoneNumber = 'phoneNumber';
      const phoneNumberWidth = pdf.widthOfString(phoneNumber);
      const phoneNumberX = (pdf.page.width - phoneNumberWidth) / 2 + 200;
      pdf.font('Helvetica').fontSize(10).text(phoneNumber, phoneNumberX, 130);

      pdf.font('Helvetica-Bold').fontSize(16).text('Invoice', 50, 200);
      pdf.font('Helvetica-Bold').fontSize(14).text('Mission Name', 50, 230);
      pdf.font('Helvetica').fontSize(10).text('Invoice Number :', 50, 260);
      pdf.font('Helvetica').fontSize(10).text('16', 130, 260);

      pdf.font('Helvetica').fontSize(10).text('StudentName', 430, 260);
      pdf.font('Helvetica').fontSize(10).text('StudentLocation', 430, 280);

      pdf.font('Helvetica').fontSize(10).text('Invoice Date :', 50, 280);
      pdf.font('Helvetica').fontSize(10).text(formattedDate, 120, 280);

      pdf.font('Helvetica').fontSize(10).text("Balance Due :", 50, 300);
      pdf.font('Helvetica').fontSize(10).text("50 €", 120, 300);
      

      // Add footer
      const footerText = 'Footer';
      const footerWidth = pdf.widthOfString(footerText);
      const footerX = (pdf.page.width - footerWidth) / 2;
      pdf.font('Helvetica').fontSize(12).text(footerText, footerX, 700);

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
        .fillColor('#3399FF') // Blue color for the title row
        .rect(50, tableYPos, 550, 20)
        .fill();

      // Add headers with colored background and lines
      headerFields.forEach((header, index) => {
        pdf
          .font('Helvetica-Bold')
          .fontSize(12)
          .fillColor('#FFFFFF') // White color for text in the title row
          .text(header, 50 + (index * 550) / headerFields.length, tableYPos);
      });

      // Increment Y position for content
      tableYPos += 20;

      // Add content rows with colored background and lines
      rows.forEach((row, i) => {
        const fillColor = i % 2 === 0 ? '#F0F0F0' : '#FFFFFF'; // Alternate row colors
        pdf.fillColor(fillColor).rect(50, tableYPos, 550, 20).fill();

        let columnX = 50;

        headerFields.forEach((field) => {
          pdf
            .font('Helvetica')
            .fontSize(8)
            .fillColor('#000000')
            .text(String(row[field]), columnX, tableYPos);
          // Draw lines between the cells
          pdf
            .moveTo(columnX, tableYPos)
            .lineTo(columnX, tableYPos + 20)
            .stroke('#000000');

          columnX += 550 / headerFields.length;
        });

        tableYPos += 20; // Increment Y position for the next row
      });

      pdf.on('end', () => {
        console.log('PDF generated successfully.');
        resolve();
      });

      pdf.on('error', (error) => {
        console.error('Error generating PDF:', error);
        reject(error);
      });

      pdf.end();
    });
  }
*/
