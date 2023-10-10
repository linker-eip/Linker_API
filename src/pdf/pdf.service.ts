import { Injectable } from '@nestjs/common';
import { createWriteStream } from 'fs';
import * as PDFDocument from 'pdfkit';

interface Row {
  [key: string]: string | number; // Each row can have a variable number of fields
}

@Injectable()
export class PdfService {
  generatePdf(content: string, filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const pdf = new PDFDocument();
      const stream = createWriteStream(filePath);
      const currentDate: Date = new Date();

      const day: number = currentDate.getDate();
      const month: number = currentDate.getMonth() + 1; // Months are zero-based
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
      pdf.font('Helvetica').fontSize(10).text('Invoice Number :', 50, 230);
      pdf.font('Helvetica').fontSize(10).text('16', 130, 230);

      pdf.font('Helvetica').fontSize(10).text('StudentName', 430, 230);
      pdf.font('Helvetica').fontSize(10).text('StudentLocation', 430, 250);

      pdf.font('Helvetica').fontSize(10).text('Invoice Date :', 50, 250);
      pdf.font('Helvetica').fontSize(10).text(formattedDate, 120, 250);

      pdf.font('Helvetica').fontSize(10).text("Balance Due :", 50, 270);
      pdf.font('Helvetica').fontSize(10).text("50 €", 120, 270);
      

      // Add footer
      const footerText = 'Footer';
      const footerWidth = pdf.widthOfString(footerText);
      const footerX = (pdf.page.width - footerWidth) / 2;
      pdf.font('Helvetica').fontSize(12).text(footerText, footerX, 700);

      // Define column headers
      const headers = ['Task', 'Description', 'Cost'];
      let tableYPos = 300;

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
}
