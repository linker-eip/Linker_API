import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { PaymentStatus } from '../enum/payment.status.enum';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true })
  productId: string;

  @Column({ type: 'varchar', nullable: true })
  priceId: string;

  @Column({ type: 'varchar', nullable: true })
  sessionId: string;

  @Column({ type: 'int', nullable: false })
  companyId: number;

  @Column({ type: 'int', nullable: false })
  missionId: number;

  @Column({ type: 'varchar', nullable: true })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  sessionUrl: string;

  @Column({ type: 'enum', enum: PaymentStatus, default: 'WAITING' })
  status: PaymentStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
