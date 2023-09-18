import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginAdminResponseDto } from './dto/login-admin-response.dto';
import { LoginAminDto } from './dto/login-admin.dto';
import { AdminService } from '../admin.service';
import * as jwt from 'jsonwebtoken';


@Injectable()
export class AuthAdminService {
    constructor(
        private readonly adminService: AdminService,
    ) {}

    async loginAdmin(body : LoginAminDto ): Promise<LoginAdminResponseDto> {
        const adminUser = await this.adminService.findOneAdminByEmail(body.email);
        if (!adminUser) {
            throw new HttpException('Mot de passe incorrect', HttpStatus.UNAUTHORIZED);
        }
        if (body.password === adminUser.password) {
            const token = jwt.sign({ email : adminUser.email, userType : "USER_ADMIN"}, process.env.JWT_SECRET);
            return { token };
        }
        return null;
    }
}
