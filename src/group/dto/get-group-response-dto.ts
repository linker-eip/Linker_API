import { ApiProperty } from "@nestjs/swagger";


export class GetGroupeResponse {
    @ApiProperty()
    name: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    picture: string;

    @ApiProperty()
    membersIds: number[];

    @ApiProperty()
    leaderId: number;

    @ApiProperty()
    isLeader: boolean;
}