import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  HttpStatus,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateCompanyProfileDto } from './dto/create-company-profile.dto';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CompanyProfileResponseDto } from './dto/company-profile-response.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadCompanyDocumentDto } from './dto/upload-company-document.dto';
import { DocumentStatusResponseDto } from './dto/document-status-response.dto';
import { VerifiedUserGuard } from '../admin/auth/guard/user.guard';

@Controller('api/company')
@UseGuards(VerifiedUserGuard)
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

  @Post('documentVerification')
  @ApiOperation({
    description: 'Upload company document',
    summary: 'Upload company document',
  })
  @ApiOkResponse({
    status: 201,
    description: 'Document uploaded successfully',
  })
  @ApiResponse({
    status: 409,
    description: 'Document is already validated',
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadStudentDocument(
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: true,
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        validators: [
          new MaxFileSizeValidator({
            maxSize: 3_500_000,
          }),
          new FileTypeValidator({
            fileType: 'application/pdf',
          }),
        ],
      }),
    )
    file,
    @Req() req,
    @Body() uploadCompanyDocument: UploadCompanyDocumentDto,
  ) {
    return this.companyService.uploadCompanyDocument(
      file,
      uploadCompanyDocument,
      req.user,
    );
  }

  @Get('documentStatus')
  @ApiOperation({
    description: 'Get all documents statuses',
    summary: 'Get all documents statuses',
  })
  @ApiOkResponse({
    description: 'Get all documents statuses',
    type: DocumentStatusResponseDto,
    isArray: true,
  })
  async getDocumentStatus(
    @Req() req,
  ): Promise<DocumentStatusResponseDto[]> {
    return await this.companyService.getDocumentStatus(req.user);
  }

  @Post('createPref')
  async createPref() {
    return this.companyService.createPref()
  }
}
