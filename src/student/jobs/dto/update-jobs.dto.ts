import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class UpdateJobsDto{
    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsString()
    logo: string;

    @ApiProperty()
    @IsString()
    city: string;

    @ApiProperty()
    @IsString()
    duration: string;

    @ApiProperty()
    @IsString()
    description: string;

}