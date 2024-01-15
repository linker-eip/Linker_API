import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum UserType {
    STUDENT_USER = "STUDENT_USER", COMPANY_USER = "COMPANY_USER"
}

export enum MessageType {
    GROUP,
    MISSION,
}

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int', nullable: false })
    author: number;

    @Column({ type: 'enum', enum: UserType, nullable: false })
    authorType: UserType;

    @Column({ type: 'enum', enum: MessageType, nullable: false })
    type: MessageType;

    @Column({ type: 'int', nullable: false })
    channelId: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    timestamp: Date;

    @Column({ type: 'varchar', nullable: false })
    content: String;
}
