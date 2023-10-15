import { Test, TestingModule } from '@nestjs/testing';
import { AuthAdminController } from './auth.admin.controller';
import { AuthAdminService } from './auth.admin.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AdminUser } from '../entity/AdminUser.entity';
import { Repository } from 'typeorm';
import { AdminService } from '../admin.service';
import { LoginAdminResponseDto } from './dto/login-admin-response.dto';
import { LoginAminDto } from './dto/login-admin.dto';

describe('AuthAdminService', () => {
  let service: AuthAdminService;
  let controller: AuthAdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '60m' },
        }),
      ],
      controllers: [AuthAdminController],
      providers: [
        AuthAdminService,
        AdminService,
        {
          provide: getRepositoryToken(AdminUser),
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<AuthAdminController>(AuthAdminController);
    service = module.get<AuthAdminService>(AuthAdminService);
  });

  describe('login', () => {
    it('should return a token', async () => {
      const loginAdminDto: LoginAminDto = {
        email: 'tonybano83@gmail.com',
        password: 'Azerty1234!',
      };
      const result: LoginAdminResponseDto = {
        token: 'token',
      };
      jest.spyOn(service, 'loginAdmin').mockImplementation(async () => result);

      const response = await controller.loginAdmin(loginAdminDto);

      expect(service.loginAdmin).toHaveBeenCalledWith(loginAdminDto);
      expect(response).toBe(result);
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
