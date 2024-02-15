import { ApiProperty } from "@nestjs/swagger";


export class GetInvitesResponse {
    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    picture: string;

    @ApiProperty()
    leaderName: string;
}