import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { DocumentStatus } from 'src/company/enum/CompanyDocument.enum';
import { StudentDocumentType } from 'src/student/enum/StudentDocument.enum';

export class DenyDocumentDto {
    @ApiProperty({required: true})
    @IsNumber()
    studentId: number;

    @ApiProperty()
    @IsEnum(StudentDocumentType)
    documentType: StudentDocumentType;

    @ApiProperty()
    @IsString()
    comment: string;
}
