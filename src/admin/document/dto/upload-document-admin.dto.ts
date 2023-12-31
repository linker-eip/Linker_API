import { ApiProperty } from '@nestjs/swagger';
import { DocumentTypeEnum } from '../../../documents/enum/document-type.enum';
import { DocumentUserEnum } from '../../../documents/enum/document-user.enum';
import { IsEnum, IsNumber, IsString } from 'class-validator';

export class UploadDocumentAdminDto {
  @ApiProperty({ type: 'string', format: 'binary', required: true })
  file: Express.Multer.File;

  @ApiProperty({ enum: DocumentTypeEnum })
  @IsEnum(DocumentTypeEnum)
  documentType: DocumentTypeEnum;

  @ApiProperty({ enum: DocumentUserEnum })
  @IsEnum(DocumentUserEnum)
  documentUser: DocumentUserEnum;

  @ApiProperty()
  @IsString()
  userId: string;
}
