import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { StudentUser } from './StudentUser.entity';
import { Studies } from '../studies/entity/studies.entity';
import { Skills } from '../skills/entity/skills.entity';
import { Jobs } from '../jobs/entity/jobs.entity';

@Entity()
export class StudentProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  studentId: number;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  picture: string;

  @OneToMany(() => Studies, (studies) => studies.studentProfile)
  studies: Studies[];

  @OneToMany(() => Skills, (skills) => skills.studentProfile)
  skills: Skills[];

  @OneToMany(() => Jobs, (jobs) => jobs.studentProfile)
  jobs: Jobs[];

  @Column({ nullable: true })
  website: string;

  @OneToOne(() => StudentUser)
  @JoinColumn({ name: 'studentId' })
  student: StudentUser;

  @Column({ type: 'float', nullable: true, default: 0 })
  note: number;

  @Column({ type: 'int', nullable: true, default: 0 })
  nbNotes: number;
}