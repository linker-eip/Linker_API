import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { InvoiceService } from './invoice.service';
import { createReadStream } from 'fs';
import { CompanyInvoiceDataDto } from '../company/dto/company-invoice-data.dto';
import { CompanyCreateInvoiceDto } from '../company/dto/company-create-invoice.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LinkerInvoiceCompanyDto } from './dto/linker-invoice-company.dto';
import { VerifiedUserGuard } from '../admin/auth/guard/user.guard';

@Controller('api/invoice')
@UseGuards(VerifiedUserGuard)
@ApiTags('Invoice')
@ApiBearerAuth()
export class InvoiceController {
  constructor(private readonly pdfService: InvoiceService) {}

  @Post('generate/student')
  async generatePdf(
    @Res() res: Response,
    @Req() req,
    @Body() body: CompanyCreateInvoiceDto,
  ): Promise<void> {
    const filePath = 'invoice.pdf';

    try {
      await this.pdfService.generateInvoice(req.user.email, body);

      res.setHeader('Content-Disposition', `attachment; filename=${filePath}`);
      res.setHeader('Content-Type', 'application/pdf');

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

  @Get('company')
  async getInvoicesForCompany(@Req() req): Promise<any> {
    return this.pdfService.getInvoicesForCompany(req.user.email);
  }

  @Get('student')
  async getInvoicesForStudent(@Req() req): Promise<any> {
    return this.pdfService.getInvoicesForStudent(req.user.email);
  }

  @Delete(':id')
  async deleteInvoice(@Param('id') id: number): Promise<any> {
    return this.pdfService.deleteInvoice(id);
  }

  @Post('generate/company')
  async generateCompanyPdf(
    @Res() res: Response,
    @Req() req,
    @Body() body: LinkerInvoiceCompanyDto,
  ): Promise<void> {
    const filePath = 'invoice.pdf';

    try {
      await this.pdfService.generateInvoiceForCompany(body);

      res.setHeader('Content-Disposition', `attachment; filename=${filePath}`);
      res.setHeader('Content-Type', 'application/pdf');

      const fileStream = createReadStream(filePath);
      fileStream.pipe(res);
    } catch (error) {
      res.status(500).send(`Error generating PDF: ${error.message}`);
    }
  }
}
