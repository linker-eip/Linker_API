import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  Param,
  ParseFilePipe,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { DocumentAdminService } from './document.admin.service';
import { UploadDocumentAdminDto } from './dto/upload-document-admin.dto';
import { DocumentSearchOptionAdminDto } from './dto/document-search-option-admin.dto';
import { Document } from '../../documents/entity/document.entity';
import { DocumentByIdPipe } from './pipes/document.pipe';
import { DocumentAdminReponseDto } from './dto/document-admin-response.dto';

@ApiBearerAuth()
@ApiTags('Admin/Documents')
@Controller('api/admin/documents')
export class DocumentAdminController {
  constructor(private readonly documentService: DocumentAdminService) {}

  @Post()
  @ApiOperation({
    description: 'Upload document',
    summary: 'Upload document',
  })
  @ApiOkResponse({
    description: 'Upload document',
    type: DocumentAdminReponseDto
  })
  @UseInterceptors(FileInterceptor('file'))
  async updateStudentProfile(
    @Body() body: UploadDocumentAdminDto,
    @UploadedFile(new ParseFilePipe({})) file,
  ): Promise<any> {
    return this.documentService.uploadDocument(file, body);
  }

  @Get()
  @ApiOperation({
    description: 'Get all documents',
    summary: 'Get all documents',
  })
  @ApiOkResponse({
    description: 'Get all documents',
    type: DocumentAdminReponseDto
  })
  async getAllDocuments(
    @Query() searchOption: DocumentSearchOptionAdminDto,
  ): Promise<any> {
    return this.documentService.getAllDocuments(searchOption);
  }

  @Delete(':id')
  @ApiOperation({
    description: 'Delete a document',
    summary: 'Delete a document',
  })
  @ApiOkResponse({
    description: 'Delete a document',
  })
  async deleteDocument(
    @Param('id', DocumentByIdPipe) document: Document,
  ): Promise<any> {
    return this.documentService.deleteDocument(document.id);
  }

  @Get(':id')
  @ApiOperation({
    description: 'Get a document',
    summary: 'Get a document',
  })
  @ApiOkResponse({
    description: 'Get a document',
    type : DocumentAdminReponseDto
  })
  async getDocument(
    @Param('id', DocumentByIdPipe) document: Document,
  ): Promise<any> {
    return this.documentService.getDocument(document.id);
  }

  @Get(':id/download')
  @ApiOperation({
    description: 'Download a document',
    summary: 'Download a document',
  })
  @ApiOkResponse({
    description: 'Download a document',
  })
  async downloadDocument(
    @Param('id', DocumentByIdPipe) document: Document,
    @Res() res,
  ): Promise<any> {
    return this.documentService.downloadDocument(document.id, res);
  }
}
