import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { DocumentStatus, CompanyDocumentType } from "../enum/CompanyDocument.enum";

@Entity()
export class CompanyDocument {
    @PrimaryColumn()
    companyId: number;

    @PrimaryColumn()
    documentType: CompanyDocumentType

    @Column()
    file: string;

    @Column()
    status: DocumentStatus

    @Column()
    comment: string
}