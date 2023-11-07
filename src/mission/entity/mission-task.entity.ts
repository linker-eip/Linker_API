import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { MissionTaskStatus } from "../enum/mission-task-status.enum";

@Entity()
export class MissionTask {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255, nullable: false })
    name: string;

    @Column({ type: 'enum', enum: MissionTaskStatus, default: 'PENDING' })
    status: MissionTaskStatus;

    @Column({ type: 'varchar', length: 1024, nullable: false })
    description: string;

    @Column({ type: 'int', nullable: false })
    missionId: number;

    @Column({ type: 'int', nullable: true})
    studentId: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}