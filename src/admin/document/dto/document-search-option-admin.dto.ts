import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { DocumentTypeEnum } from "../../../documents/enum/document-type.enum";
import { DocumentUserEnum } from "../../../documents/enum/document-user.enum";

export class DocumentSearchOptionAdminDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    searchString?: string;
    
    @ApiPropertyOptional()
    @IsOptional()
    documentType?: DocumentTypeEnum;
    
    @ApiPropertyOptional()
    @IsOptional()
    documentUser?: DocumentUserEnum;
    
    @ApiPropertyOptional()
    @IsOptional()
    userId?: string;
}