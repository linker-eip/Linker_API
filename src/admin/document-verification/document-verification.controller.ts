import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DocumentVerificationService } from './document-verification.service';
import { GetDocumentStatusCompanyResponseDto, GetDocumentStatusStudentsResponseDto } from './dto/get-document-response.dto';
import { ValidateDocumentCompanyDto, ValidateDocumentStudentDto } from './dto/validate-document.dto';
import { DenyDocumentCompanyDto, DenyDocumentStudentDto } from './dto/deny-document.dto';

@ApiBearerAuth()
@ApiTags('Admin/DocumentVerification')
@Controller('api/admin/document-verification')
export class DocumentVerificationController {
    constructor(
        private readonly documentVerificationService: DocumentVerificationService
    ) {}

    @Get('students')
    @ApiOperation({
        description: 'Get all documents to be verified (students)',
        summary: 'Get all documents to be verified (students)',
    })
    @ApiOkResponse({
        isArray: true,
        type: GetDocumentStatusStudentsResponseDto
    })
    async getAllDocuments(): Promise<GetDocumentStatusStudentsResponseDto> {
        return this.documentVerificationService.getAllDocumentsStudent();
    }

    @Get('company')
    @ApiOperation({
        description: 'Get all documents to be verified (company)',
        summary: 'Get all documents to be verified (company)',
    })
    @ApiOkResponse({
        isArray: true,
        type: GetDocumentStatusStudentsResponseDto
    })
    async getAllDocumentsCompany(): Promise<GetDocumentStatusCompanyResponseDto> {
        return this.documentVerificationService.getAllDocumentsCompany();
    }

    @Post('students/validate')
    @ApiOperation({
        description: 'Validate document',
        summary: 'Validate document',
    })
    async validateDocumentStudent(@Body() dto: ValidateDocumentStudentDto) {
        return this.documentVerificationService.validateDocumentStudent(dto)
    }

    @Post('students/deny')
    @ApiOperation({
        description: 'Deny document',
        summary: 'Deny document',
    })
    async denyDocumentStudent(@Body() dto: DenyDocumentStudentDto) {
        return this.documentVerificationService.denyDocumentStudent(dto)
    }

    @Post('company/validate')
    @ApiOperation({
        description: 'Validate document',
        summary: 'Validate document',
    })
    async validateDocumentCompany(@Body() dto: ValidateDocumentCompanyDto) {
        return this.documentVerificationService.validateDocumentCompany(dto)
    }

    @Post('company/deny')
    @ApiOperation({
        description: 'Deny document',
        summary: 'Deny document',
    })
    async denyDocumentCompany(@Body() dto: DenyDocumentCompanyDto) {
        return this.documentVerificationService.denyDocumentCompany(dto)
    }
}
