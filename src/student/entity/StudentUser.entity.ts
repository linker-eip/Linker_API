import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Mission } from '../../mission/entity/mission.entity';
import { StudentProfile } from './StudentProfile.entity';

@Entity()
export class StudentUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  firstName: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  lastName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  picture: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastConnectedAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'varchar', nullable: true })
  resetPasswordToken: string;

  @Column({ type: 'boolean', default: false })
  isVerified: boolean;

  @Column({ type: 'varchar', nullable: true })
  verificationKey: string;

  @Column('simple-array', { nullable: true })
  missionsIds: number[];

  @Column({ type: 'int', default: null, nullable: true })
  groupId: number;

  @OneToOne(() => StudentProfile, (studentProfile) => studentProfile.student, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'profileId' })
  profile: StudentProfile;
}
