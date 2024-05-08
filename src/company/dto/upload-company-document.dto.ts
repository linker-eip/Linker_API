import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { CompanyDocumentType } from "../enum/CompanyDocument.enum";

export class UploadCompanyDocumentDto {
    @ApiProperty({description:"Fichier au format PDF"})
    file: Express.Multer.File;

    @ApiProperty({description: "Type de document", enum: CompanyDocumentType})
    @IsEnum(CompanyDocumentType)
    documentType: CompanyDocumentType;
}