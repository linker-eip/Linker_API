import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class LinkedinDto {
    @ApiProperty()
    @IsString()
    url: string
}