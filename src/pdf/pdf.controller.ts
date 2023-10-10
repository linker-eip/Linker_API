// pdf.controller.ts
import { Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { PdfService } from './pdf.service';
import { createReadStream } from 'fs';

@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Post('generate')
  async generatePdf(@Res() res: Response): Promise<void> {
    const filePath = 'output.pdf';
    const content = 'zzzzzzzz';

    try {
      await this.pdfService.generatePdf(content, filePath);

      // Set the response headers for PDF download
      res.setHeader('Content-Disposition', `attachment; filename=${filePath}`);
      res.setHeader('Content-Type', 'application/pdf');
      
      // Stream the PDF file for download
      const fileStream = createReadStream(filePath);
      fileStream.pipe(res);
    } catch (error) {
      res.status(500).send(`Error generating PDF: ${error.message}`);
    }
  }
}
