import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { Studies } from "../studies/entity/studies.entity";
import { Skills } from "../skills/entity/skills.entity";
import { Jobs } from "../jobs/entity/jobs.entity";

export class CreateStudentProfileDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  email: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  phone: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  location: string;

  @ApiProperty()
  @IsOptional()
  studies?: Studies[];

  @ApiProperty()
  @IsOptional()
  skills?: Skills[];

  @ApiProperty()
  @IsOptional()
  jobs?: Jobs[];

  @ApiProperty()
  @IsString()
  @IsOptional()
  website: string;
}