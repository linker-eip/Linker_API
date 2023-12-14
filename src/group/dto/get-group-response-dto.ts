import { ApiProperty } from "@nestjs/swagger";


export class GetGroupeResponse {
    @ApiProperty()
    name: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    picture: string;

    @ApiProperty()
    members: groupMembersDto[];

    @ApiProperty()
    leaderId: number;

    @ApiProperty()
    isLeader: boolean;
}

export class groupMembersDto {
    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    picture: string;

    @ApiProperty()
    isLeader: boolean;

    @ApiProperty()
    id: number;
}