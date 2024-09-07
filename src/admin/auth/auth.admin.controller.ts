import { Body, Controller, Param, Post } from '@nestjs/common';
import { AuthAdminService } from './auth.admin.service';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation, ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { LoginAdminResponseDto } from './dto/login-admin-response.dto';
import { LoginAminDto } from './dto/login-admin.dto';
import { UserType } from '../../chat/entity/Message.entity';

@ApiBearerAuth()
@ApiTags('Admin/Auth')
@Controller('api/admin/auth')
@ApiBearerAuth()
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

  @Post('block/:userType/:userId')
  @ApiOperation({
    description: 'Block user',
    summary: 'Block user',
  })
  @ApiOkResponse({
    description: 'Block user',
    type: Boolean,
  })
  @ApiParam({ name: 'userId', type: Number })
  @ApiParam({ name: 'userType', enum: UserType })
  async blockUser(@Param('userType') userType: UserType, @Param('userId') userId: number) {
    return this.authAdminService.blockUser(userType, userId);
  }
}
