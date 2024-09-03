import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNumber } from 'class-validator';
import {
  CompanyDocumentType,
  DocumentStatus,
} from '../../../company/enum/CompanyDocument.enum';
import { StudentDocumentType } from '../../../student/enum/StudentDocument.enum';

export class ValidateDocumentStudentDto {
  @ApiProperty({ required: true })
  @IsNumber()
  studentId: number;

  @ApiProperty()
  @IsEnum(StudentDocumentType)
  documentType: StudentDocumentType;

  @ApiProperty({ default: false, required: false })
  @IsBoolean()
  bis?: boolean = false;
}

export class ValidateDocumentCompanyDto {
  @ApiProperty({ required: true })
  @IsNumber()
  companyId: number;

  @ApiProperty()
  @IsEnum(CompanyDocumentType)
  documentType: CompanyDocumentType;

  @ApiProperty({ default: false, required: false })
  @IsBoolean()
  bis?: boolean = false;
}
