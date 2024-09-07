import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserType } from '../../chat/entity/Message.entity';

export enum TicketTypeEnum {
  GENERAL = 'GENERAL',
  MISSION = 'MISSION',
  GROUP = 'GROUP',
}

export enum TicketStateEnum {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  authorId: number;

  @Column()
  authorType: UserType;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ nullable: true })
  attachment?: string;

  @Column()
  ticketType: TicketTypeEnum;

  @Column({ nullable: true })
  entityId?: number;

  @Column()
  state: TicketStateEnum;
}

