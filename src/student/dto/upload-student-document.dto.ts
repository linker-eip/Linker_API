import { ApiProperty } from '@nestjs/swagger';
import { StudentDocumentType } from '../enum/StudentDocument.enum';
import { IsEnum } from 'class-validator';

export class UploadStudentDocumentDto {
  @ApiProperty({ description: 'Fichier au format PDF' })
  file: Express.Multer.File;

  @ApiProperty({ description: 'Type de document', enum: StudentDocumentType })
  @IsEnum(StudentDocumentType)
  documentType: StudentDocumentType;
}
