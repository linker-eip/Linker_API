import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class StudentPreferences {
    @PrimaryColumn()
    studentId: number;

    @Column({default: false})
    mailNotifMessage: boolean

    @Column({default: false})
    mailNotifGroup: boolean

    @Column({default: false})
    mailNotifMission: boolean

    @Column({default: false})
    mailNotifDocument: boolean
}