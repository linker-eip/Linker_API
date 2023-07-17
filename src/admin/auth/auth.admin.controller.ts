import { Body, Controller, Post } from '@nestjs/common';
import { AuthAdminService } from './auth.admin.service';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { LoginAdminResponseDto } from './dto/login-admin-response.dto';
import { LoginAminDto } from './dto/login-admin.dto';

@Controller('api/admin/auth')
export class AuthAdminController {
  constructor(private readonly authAdminService: AuthAdminService) {}

  @Post('login')
  @ApiOperation({
    description: 'Login admin',
    summary: 'Login admin',
  })
  @ApiOkResponse({
    description: 'Login admin',
    type: LoginAdminResponseDto,
  })
  async loginAdmin(@Body() body: LoginAminDto): Promise<LoginAdminResponseDto> {
    const admin = await this.authAdminService.loginAdmin(body);
    return admin;
  }
}
