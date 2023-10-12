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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});


