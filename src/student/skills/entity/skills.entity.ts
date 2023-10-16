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
export class Skills {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  logo: string;

  @ManyToOne(() => StudentProfile, (studentProfile) => studentProfile.skills)
  studentProfile: StudentProfile;
}
