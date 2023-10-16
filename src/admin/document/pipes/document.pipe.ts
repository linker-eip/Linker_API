import { Injectable, NotFoundException, PipeTransform } from "@nestjs/common";
import { DocumentAdminService } from "../document.admin.service";

@Injectable()
export class DocumentByIdPipe implements PipeTransform {
    constructor(private readonly documentService: DocumentAdminService) {}

    async transform(documentId: string) {
        if (isNaN(parseInt(documentId)))
            throw new NotFoundException('DOCUMENT_NOT_FOUND');
        const document = await this.documentService.findDocumentById(
            parseInt(documentId),
        );
        if (document) return document.id;
        else throw new NotFoundException('DOCUMENT_NOT_FOUND');
    }
}