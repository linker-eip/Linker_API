import { Entity, PrimaryColumn, PrimaryGeneratedColumn, Column } from 'typeorm';
import { MissionInviteStatus } from '../enum/mission-invite-status.enum';

@Entity()
export class MissionInvite {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  missionId: number;

  @Column({ type: 'int', nullable: false })
  groupId: number;

  @Column({ type: 'enum', enum: MissionInviteStatus, default: 'PENDING' })
  status: MissionInviteStatus;
}
