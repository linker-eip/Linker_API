import { ApiProperty } from '@nestjs/swagger';
import { CompanyDocumentType, DocumentStatus } from '../enum/CompanyDocument.enum';

export class DocumentStatusResponseDto {
    @ApiProperty()
    documentType: CompanyDocumentType

    @ApiProperty()
    status: DocumentStatus

    @ApiProperty()
    comment: string

    @ApiProperty()
    bis: boolean
}
