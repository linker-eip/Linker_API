import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { Studies } from "../studies/entity/studies.entity";
import { Skills } from "../skills/entity/skills.entity";
import { Jobs } from "../jobs/entity/jobs.entity";
import { StudiesDto } from "../studies/dto/studies.dto";
import { SkillsDto } from "../skills/dto/skills.dto";
import { JobsDto } from "../jobs/dto/jobs.dto";

export class CreateStudentProfileDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  lastName: string;

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
  picture: Express.Multer.File;

  @ApiProperty({type : StudiesDto, isArray : true})
  @IsOptional()
  studies?: Studies[];

  @ApiProperty({type : SkillsDto, isArray : true})
  @IsOptional()
  skills?: Skills[];

  @ApiProperty({type : JobsDto, isArray : true})
  @IsOptional()
  jobs?: Jobs[];

  @ApiProperty()
  @IsString()
  @IsOptional()
  website: string;
}