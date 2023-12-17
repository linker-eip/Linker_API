import { ApiProperty } from "@nestjs/swagger";


export class GetInvitesResponse {
    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;

    @ApiProperty()
    picture: string;
}