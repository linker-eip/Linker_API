import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserType } from '../../chat/entity/Message.entity';

export enum TicketTypeEnum {
  GENERAL= 'GENERAL',
  MISSION= 'MISSION',
  GROUP= 'GROUP',
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

  @Column()
  attachment?: string;

  @Column()
  ticketType: TicketTypeEnum;

  @Column()
  entityId?: number;
}
