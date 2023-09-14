import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { DocumentTypeEnum } from '../enum/document-type.enum';
import { DocumentUserEnum } from '../enum/document-user.enum';

@Entity()
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  documentPath: string;

  @Column({ type: 'varchar', length: 255 })
  documentType: DocumentTypeEnum;

  @Column({ type: 'varchar', length: 255 })
  documentUser: DocumentUserEnum;

  @Column({ type: 'int' })
  userId: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
