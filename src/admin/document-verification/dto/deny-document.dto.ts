import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNumber, IsString } from 'class-validator';
import { CompanyDocumentType, DocumentStatus } from '../../../company/enum/CompanyDocument.enum';
import { StudentDocumentType } from '../../../student/enum/StudentDocument.enum';

export class DenyDocumentStudentDto {
    @ApiProperty({required: true})
    @IsNumber()
    studentId: number;

    @ApiProperty()
    @IsEnum(StudentDocumentType)
    documentType: StudentDocumentType;

    @ApiProperty()
    @IsString()
    comment: string;

    @ApiProperty({default: false, required: false})
    @IsBoolean()
    bis?: boolean = false;
}

export class DenyDocumentCompanyDto {
    @ApiProperty({required: true})
    @IsNumber()
    companyId: number;

    @ApiProperty()
    @IsEnum(CompanyDocumentType)
    documentType: CompanyDocumentType;

    @ApiProperty()
    @IsString()
    comment: string;

    @ApiProperty({default: false, required: false})
    @IsBoolean()
    bis?: boolean = false;
}