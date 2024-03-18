import { ApiProperty } from '@nestjs/swagger';
import { DocumentStatus, StudentDocumentType } from '../enum/StudentDocument.enum';

export class DocumentStatusResponseDto {
    @ApiProperty()
    documentType: StudentDocumentType

    @ApiProperty()
    status: DocumentStatus

    @ApiProperty()
    comment: string
}
