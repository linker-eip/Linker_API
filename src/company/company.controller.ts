import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateCompanyProfileDto } from './dto/create-company-profile.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CompanyProfileResponseDto } from './dto/company-profile-response.dto';

@Controller('api/company')
@UseGuards(AuthGuard('jwt'))
@ApiTags('Company')
@ApiBearerAuth()
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get('profile')
  @ApiOperation({
    description: 'Get company profile',
    summary: 'Get company profile',
  })
  @ApiResponse({
    status: 200,
    description: 'Get company profile',
    type: CompanyProfileResponseDto,
  })
  async getCompanyProfile(@Req() req) {
    return this.companyService.findCompanyProfile(req.user.email);
  }

  @Put('profile')
  @ApiOperation({
    description: 'Update company profile',
    summary: 'Update company profile',
  })
  @ApiResponse({
    status: 200,
    description: 'Update company profile',
    type: CompanyProfileResponseDto,
  })
  async updateCompanyProfile(
    @Req() req,
    @Body() CreateCompanyProfile: CreateCompanyProfileDto,
  ) {
    return this.companyService.updateCompanyProfile(
      CreateCompanyProfile,
      req.user,
    );
  }
}
