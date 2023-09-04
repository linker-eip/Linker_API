import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { MissionStatus } from "../enum/mission-status.enum";
import { CompanyUser } from "../../company/entity/CompanyUser.entity";
import { StudentUser } from "../../student/entity/StudentUser.entity";

@Entity()
export class Missions {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "varchar", length: 255, nullable: false})
    name: string;

    @Column({type: 'enum', enum: MissionStatus, default: 'PENDING'})
    status: MissionStatus;

    @Column({type: "varchar", length: 1024})
    description: string;

    @Column()
    company: CompanyUser;

    @ManyToMany(() => StudentUser, studentUser => studentUser.missions)
    students: StudentUser[];

    @Column({type: "timestamp"})
    startOfMission: Date;

    @Column({type: "timestamp"})
    endOfMission: Date;

    @Column({type : "float", nullable: false})
    amount: number;
}