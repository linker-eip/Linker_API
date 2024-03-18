import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DocumentVerificationService } from './document-verification.service';
import { GetDocumentStatusResponseDto } from './dto/get-document-response.dto';
import { ValidateDocumentDto } from './dto/validate-document.dto';
import { DenyDocumentDto } from './dto/deny-document.dto';

@ApiBearerAuth()
@ApiTags('Admin/DocumentVerification')
@Controller('api/admin/document-verification')
export class DocumentVerificationController {
    constructor(
        private readonly documentVerificationService: DocumentVerificationService
    ) {}

    @Get('students')
    @ApiOperation({
        description: 'Get all documents to be verified',
        summary: 'Create a mission',
    })
    @ApiOkResponse({
        isArray: true,
        type: GetDocumentStatusResponseDto
    })
    async getAllDocuments(): Promise<GetDocumentStatusResponseDto> {
        return this.documentVerificationService.getAllDocuments();
    }

    @Post('students/validate')
    @ApiOperation({
        description: 'Validate document',
        summary: 'Validate document',
    })
    async validateDocument(@Body() dto: ValidateDocumentDto) {
        return this.documentVerificationService.validateDocument(dto)
    }

    @Post('students/deny')
    @ApiOperation({
        description: 'Deny document',
        summary: 'Deny document',
    })
    async denyDocument(@Body() dto: DenyDocumentDto) {
        return this.documentVerificationService.denyDocument(dto)
    }
}
