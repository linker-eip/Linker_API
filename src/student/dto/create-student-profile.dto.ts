import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { Studies } from '../studies/entity/studies.entity';
import { Jobs } from '../jobs/entity/jobs.entity';
import { StudiesDto } from '../studies/dto/studies.dto';
import { JobsDto } from '../jobs/dto/jobs.dto';

export class UpdateSkillsDto {
  @IsArray()
  @IsOptional()
  Development: string[];

  @IsArray()
  @IsOptional()
  'No-code': string[];

  @IsArray()
  @IsOptional()
  'Design & Produit': string[];

  @IsArray()
  @IsOptional()
  Data: string[];

  @IsArray()
  @IsOptional()
  'Marketing & Sales': string[];
}

export class CreateStudentProfileDto {
  @ApiProperty({ description: "Prénom de l'utilisateur" })
  @IsString({ message: 'Le prénom doit être une chaîne de caractères' })
  @IsOptional()
  firstName: string;

  @ApiProperty({ description: "Nom de famille de l'utilisateur" })
  @IsString({ message: 'Le nom de famille doit être une chaîne de caractères' })
  @IsOptional()
  lastName: string;

  @ApiProperty({ description: "Description de l'utilisateur" })
  @IsString({ message: 'La description doit être une chaîne de caractères' })
  @IsOptional()
  description: string;

  @ApiProperty({ description: "Adresse email de l'utilisateur" })
  @IsString({ message: "L'email doit être une chaîne de caractères" })
  @IsOptional()
  email: string;

  @ApiProperty({ description: "Numéro de téléphone de l'utilisateur" })
  @IsString({
    message: 'Le numéro de téléphone doit être une chaîne de caractères',
  })
  @IsOptional()
  phone: string;

  @ApiProperty({ description: "Emplacement de l'utilisateur" })
  @IsString({ message: "L'emplacement doit être une chaîne de caractères" })
  @IsOptional()
  location: string;

  @ApiProperty({ description: "Image de profil de l'utilisateur" })
  @IsOptional()
  picture: Express.Multer.File;

  @ApiProperty({
    description: 'Études de l\'utilisateur',
    type: StudiesDto,
    isArray: true,
  })
  @IsOptional()
  studies?: Studies[];

  @ApiProperty({
    description: 'Compétences de l\'utilisateur',
    type: UpdateSkillsDto,
  })
  @IsOptional()
  skills?: UpdateSkillsDto;

  @ApiProperty({
    description: 'Emplois de l\'utilisateur',
    type: JobsDto,
    isArray: true,
  })
  @IsOptional()
  jobs?: Jobs[];

  @ApiProperty({ description: "Site web de l'utilisateur" })
  @IsString({ message: 'Le site web doit être une chaîne de caractères' })
  @IsOptional()
  website: string;

  @ApiProperty({ description: "TJM de l'utilisateur" })
  @IsNumber()
  @IsOptional()
  tjm: number;
}
