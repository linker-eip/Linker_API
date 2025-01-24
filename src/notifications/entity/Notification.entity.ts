import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum NotificationType {
  MESSAGE,
  GROUP,
  MISSION,
  DOCUMENT,
  TICKET,
  ACCOUNT,
}

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  text: string;

  @Column({ nullable: true })
  enTitle?: string;

  @Column({ nullable: true })
  enText?: string;

  @Column({ nullable: false })
  type: NotificationType;

  @Column({ type: 'int', nullable: true })
  studentId?: number;

  @Column({ type: 'int', nullable: true })
  companyId?: number;

  @Column({ type: 'boolean', nullable: false, default: false })
  isDeleted: boolean;

  @Column({ type: 'boolean', nullable: false, default: false })
  alreadySeen: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;
}
