import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { PdfService } from './pdf.service';
import { createReadStream } from 'fs';
import { CompanyInvoiceDataDto } from '../company/dto/company-invoice-data.dto';
import { CompanyCreateInvoiceDto } from '../company/dto/company-create-invoice.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('pdf')
@UseGuards(AuthGuard('jwt'))
@ApiTags('Pdf')
@ApiBearerAuth()
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Post('generate')
  async generatePdf(
    @Res() res: Response,
    @Req() req,
    @Body() body: CompanyCreateInvoiceDto,
  ): Promise<void> {
    const filePath = 'output.pdf';

    try {
      await this.pdfService.generateInvoice(req.user.email, body);

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
