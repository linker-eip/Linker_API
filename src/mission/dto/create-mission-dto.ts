import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsDateString, IsNumber, IsString } from 'class-validator';

export class CreateMissionDto {
  @ApiProperty({ description: "Nom de la mission" })
  @IsString({ message: "Le nom doit être une chaîne de caractères" })
  name: string;
  
  @ApiProperty({ description: "Description de la mission" })
  @IsString({ message: "La description doit être une chaîne de caractères" })
  description: string;
  
  @ApiProperty({ description: "Date de début de la mission" })
  @IsDateString(undefined, { message: "La date de début doit être au format de date valide" })
  startOfMission: Date;
  
  @ApiProperty({ description: "Date de fin de la mission" })
  @IsDateString(undefined, { message: "La date de fin doit être au format de date valide" })
  endOfMission: Date;
  
  @ApiProperty({ description: "Montant de la mission" })
  @IsNumber(undefined, { message: "Le montant doit être un nombre" })
  amount: number;
  
}
