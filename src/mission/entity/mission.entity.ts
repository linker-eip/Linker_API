import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MissionStatus } from '../enum/mission-status.enum';
import { CompanyUser } from '../../company/entity/CompanyUser.entity';

@Entity()
export class Mission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'enum', enum: MissionStatus, default: 'PENDING' })
  status: MissionStatus;

  @Column({ type: 'varchar', length: 1024 })
  description: string;

  @Column({ type: 'int', nullable: true })
  companyId: number;

  @Column('simple-array', { nullable: true })
  studentsIds: number[];

  @Column({ type: 'timestamp' })
  startOfMission: Date;

  @Column({ type: 'timestamp' })
  endOfMission: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'float', nullable: false })
  amount: number;
}
