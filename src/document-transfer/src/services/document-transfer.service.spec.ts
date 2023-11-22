import { Test, TestingModule } from '@nestjs/testing';
import { DocumentTransferService } from './document-transfer.service';

describe('DocumentTransferService', () => {
  let service: DocumentTransferService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DocumentTransferService],
    }).compile();

    service = module.get<DocumentTransferService>(DocumentTransferService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
