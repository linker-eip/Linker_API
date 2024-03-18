import { ApiProperty } from '@nestjs/swagger';
import { CompanyDocumentType, DocumentStatus } from 'src/company/enum/CompanyDocument.enum';
import { StudentDocumentType } from 'src/student/enum/StudentDocument.enum';

export class GetDocumentStatusStudentsResponseDto {
    @ApiProperty()
    studentId: number;

    @ApiProperty()
    documentType: StudentDocumentType

    @ApiProperty()
    file: string

    @ApiProperty()
    status: DocumentStatus

    @ApiProperty()
    comment: string
}

export class GetDocumentStatusCompanyResponseDto {
    @ApiProperty()
    companyId: number;

    @ApiProperty()
    documentType: CompanyDocumentType

    @ApiProperty()
    file: string

    @ApiProperty()
    status: DocumentStatus

    @ApiProperty()
    comment: string
}
