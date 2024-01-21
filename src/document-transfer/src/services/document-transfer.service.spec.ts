import { Test, TestingModule } from '@nestjs/testing';
import { DocumentTransferService } from './document-transfer.service';
import { ConfigService } from '@nestjs/config';

describe('DocumentTransferService', () => {
  let service: DocumentTransferService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DocumentTransferService, ConfigService],
    }).compile();

    service = module.get<DocumentTransferService>(DocumentTransferService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
