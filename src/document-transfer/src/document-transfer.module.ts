import { Module } from '@nestjs/common';
import { DocumentTransferService } from './services/document-transfer.service';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [DocumentTransferService, ConfigService],
  exports: [DocumentTransferService],
})
export class DocumentTransferModule {}
