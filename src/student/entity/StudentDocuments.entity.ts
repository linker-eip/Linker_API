import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { DocumentStatus, StudentDocumentType } from "../enum/StudentDocument.enum";

@Entity()
export class StudentDocument {
    @PrimaryColumn()
    studentId: number;

    @PrimaryColumn()
    documentType: StudentDocumentType

    @Column()
    file: string;

    @Column()
    status: DocumentStatus

    @Column()
    comment: string
}