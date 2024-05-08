import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Group {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, nullable: false })
    name: string;

    @Column({ nullable: false })
    description: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    picture: string;

    @Column('simple-array', {default:[], nullable: false})
    studentIds: number[];

    @Column({ type: 'int', nullable: false })
    leaderId: number;

    @Column({ type: 'boolean', default: true, nullable: true })
    isActive: boolean;
}