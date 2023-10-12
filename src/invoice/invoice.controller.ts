import { Body, Controller, Get, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { InvoiceService } from './invoice.service';
import { createReadStream } from 'fs';
import { CompanyInvoiceDataDto } from '../company/dto/company-invoice-data.dto';
import { CompanyCreateInvoiceDto } from '../company/dto/company-create-invoice.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('pdf')
@UseGuards(AuthGuard('jwt'))
@ApiTags('Pdf')
@ApiBearerAuth()
export class InvoiceController {
  constructor(private readonly pdfService: InvoiceService) {}

  @Post('generate')
  async generatePdf(
    @Res() res: Response,
    @Req() req,
    @Body() body: CompanyCreateInvoiceDto,
  ): Promise<void> {
    const filePath = 'invoice.pdf';

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

  @Get('download/:id')
  async getInvoice(
    @Param('id') id: number,
    @Res() res: Response,
  ): Promise<void> {
    this.pdfService.downloadInvoice(id, res);
  }
}
