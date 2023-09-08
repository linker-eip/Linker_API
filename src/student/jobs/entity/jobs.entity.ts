import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StudentProfile } from '../../entity/StudentProfile.entity';

@Entity()
export class Jobs {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  position : string;

  @Column()
  logo: string;

  @Column()
  city: string;

  @Column()
  duration: string;

  @Column()
  description: string;

  @ManyToOne(() => StudentProfile, (studentProfile) => studentProfile.jobs)
  studentProfile: StudentProfile;
}
