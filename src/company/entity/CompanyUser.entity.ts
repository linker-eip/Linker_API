import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CompanyProfile } from './CompanyProfile.entity';

@Entity()
export class CompanyUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  companyName: string;

  @Column({ type: 'varchar', length: 13, nullable: false })
  phoneNumber: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  picture: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  companyPicture: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastConnectedAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @OneToOne(() => CompanyProfile, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'profileId', referencedColumnName: 'id' }])
  profile: CompanyProfile;

  @Column({ type: 'varchar', nullable: true })
  resetPasswordToken: string;
}
