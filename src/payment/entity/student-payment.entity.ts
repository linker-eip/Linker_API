import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { StudentPaymentStatus } from "../enum/student-payment.status.enum";


@Entity()
export class StudentPayment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int', nullable: false })
    missionId: number;

    @Column({ type: 'int', nullable: false })
    studentId: number;

    @Column({ type: 'enum', enum: StudentPaymentStatus, default: 'PENDING' })
    status: StudentPaymentStatus;

    @Column({ type: 'int', nullable: false })
    amount: number;
}