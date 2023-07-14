import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CompanyUser } from 'src/company/entity/CompanyUser.entity';
import { StudentUser } from './StudentUser.entity';

@Entity()
export class StudentProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  studentId: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  studies: string;

  @Column({ nullable: true })
  skills: string;

  @Column({ nullable: true })
  website: string;

  @OneToOne(() => CompanyUser)
  @JoinColumn({ name: 'companyId' })
  student: StudentUser;
}

