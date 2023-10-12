import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { FileService } from '../filesystem/file.service';
import { AuthGuard, PassportModule } from '@nestjs/passport';
import { FileController } from './file.controller';

describe('FileService', () => {
  let service: FileService;
  let controller: FileController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '60m' },
        }),
      ],
      controllers: [FileController],
      providers: [FileService],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<FileController>(FileController);
    service = module.get<FileService>(FileService);
  });

  describe('getFile', () => {
    it('should return a file object', async () => {
      jest.spyOn(service, 'getFile').mockReturnValueOnce(null)

      const response = await controller.getFile("fileName", null)
      expect(response).toEqual(null);
    })
  })

  describe('uploadFile', () => {
    it('should upload a file', async () => {
      const file: Express.Multer.File = {
        fieldname: 'file',
        originalname: 'test-file.txt',
        encoding: '7bit',
        mimetype: 'text/plain',
        destination: './uploads',
        filename: 'test-file.txt',
        path: './uploads/test-file.txt',
        size: 12345,
        stream: null,
        buffer: Buffer.from(''),

      };

      jest.spyOn(service, 'storeFile').mockReturnValueOnce(Promise.resolve("linker-external/public/test-file.txt"));

      const response = await controller.uploadFile(file)

      expect(response).toEqual('linker-external/public/test-file.txt');
      expect(service.storeFile).toHaveBeenCalledWith(file);
    })
  });


  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});


