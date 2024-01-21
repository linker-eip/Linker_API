/* istanbul ignore file */

import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  Delete,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { DocumentTransferService } from './services/document-transfer.service';

@Controller('api/document')
@ApiTags('DOCUMENT')
export class DocumentTransferController {
  constructor(private readonly documentTransferService: DocumentTransferService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  }))
  async uploadDocument(@UploadedFile() file: Express.Multer.File): Promise<any> {
    if (!file) {
      throw new HttpException('File is required', HttpStatus.BAD_REQUEST);
    }

    return await this.documentTransferService.uploadFile(file);
  }

  @Delete(':key')
  async deleteDocument(@Param('key') key: string): Promise<void> {
    if (!key) {
      throw new HttpException('Key is required', HttpStatus.BAD_REQUEST);
    }
    return await this.documentTransferService.deleteFile(key);
  }
}
