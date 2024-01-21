import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { MissionStatus } from '../enum/mission-status.enum';

export class UpdateMissionDto {
  @ApiProperty({ description: "Nom de la mission" })
  @IsString({ message: "Le nom doit être une chaîne de caractères" })
  @IsOptional()
  name: string;
  
  @ApiProperty({ description: "Description de la mission" })
  @IsString({ message: "La description doit être une chaîne de caractères" })
  @IsOptional()
  description: string;
  
  @ApiProperty({ description: "Date de début de la mission" })
  @IsDateString(undefined, { message: "La date de début doit être au format de date valide" })
  @IsOptional()
  startOfMission: Date;
  
  @ApiProperty({ description: "Date de fin de la mission" })
  @IsDateString(undefined, { message: "La date de fin doit être au format de date valide" })
  @IsOptional()
  endOfMission: Date;
  
  @ApiProperty({ description: "Montant de la mission" })
  @IsNumber(undefined, { message: "Le montant doit être un nombre" })
  @IsOptional()
  amount: number;

  @ApiProperty({ description: "Compétences" })
  @IsString({ message: "Les compétences doivent être une chaîne de caractères" })
  @IsOptional()
  skills: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  groupId: number;
}
