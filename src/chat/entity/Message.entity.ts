import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { MessageType } from '../enum/MessageType.enum';

export enum UserType {
  STUDENT_USER = 'STUDENT_USER',
  COMPANY_USER = 'COMPANY_USER',
}

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  author: number;

  @Column({ type: 'enum', enum: UserType, nullable: false })
  authorType: UserType;

  @Column({ type: 'enum', enum: MessageType, nullable: false })
  type: MessageType;

  @Column({ type: 'varchar', nullable: false })
  channelId: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  @Column({ type: 'varchar', nullable: false })
  content: string;

  @Column({ type: 'boolean', nullable: false, default: false })
  isFile: boolean;
}
