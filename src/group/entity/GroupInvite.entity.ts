import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class GroupInvite {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type :'int', nullable: false})
    groupId: number;

    @Column({type :'int', nullable: false})
    userId: number;
}