import { ApiProperty } from '@nestjs/swagger';
import { DocumentStatus } from 'src/company/enum/CompanyDocument.enum';
import { StudentDocumentType } from 'src/student/enum/StudentDocument.enum';

export class GetDocumentStatusResponseDto {
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
