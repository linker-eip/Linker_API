import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CompanyUser } from './CompanyUser.entity';

@Entity()
export class CompanyProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  companyId: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  size: number;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  activity: string;

  @Column({ nullable: true })
  speciality: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  picture: string;

  @OneToOne(() => CompanyUser)
  @JoinColumn({ name: 'companyId' })
  company: CompanyUser;
}

