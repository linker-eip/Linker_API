import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber } from 'class-validator';
import { CompanyDocumentType, DocumentStatus } from '../../company/enum/CompanyDocument.enum';
import { StudentDocumentType } from '../../student/enum/StudentDocument.enum';

export class ValidateDocumentStudentDto {
    @ApiProperty({required: true})
    @IsNumber()
    studentId: number;

    @ApiProperty()
    @IsEnum(StudentDocumentType)
    documentType: StudentDocumentType;
}

export class ValidateDocumentCompanyDto {
    @ApiProperty({required: true})
    @IsNumber()
    companyId: number;

    @ApiProperty()
    @IsEnum(CompanyDocumentType)
    documentType: CompanyDocumentType;
}
