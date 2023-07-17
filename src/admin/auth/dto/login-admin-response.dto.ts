import { ApiProperty } from "@nestjs/swagger";


export class LoginAdminResponseDto {
    @ApiProperty()
    token: string;
}