import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class CreateCompanyProfileDto {
  @ApiProperty({ description: "Nom de l'entreprise" })
  @IsString({ message: "Le nom doit être une chaîne de caractères" })
  name: string;
  
  @ApiProperty({ description: "Description de l'entreprise" })
  @IsString({ message: "La description doit être une chaîne de caractères" })
  description: string;
  
  @ApiProperty({ description: "Adresse email de l'entreprise" })
  @IsString({ message: "L'email doit être une chaîne de caractères" })
  email: string;
  
  @ApiProperty({ description: "Numéro de téléphone de l'entreprise" })
  @IsString({ message: "Le numéro de téléphone doit être une chaîne de caractères" })
  phone: string;
  
  @ApiProperty({ description: "Adresse de l'entreprise" })
  @IsString({ message: "L'adresse doit être une chaîne de caractères" })
  address: string;
  
  @ApiProperty({ description: "Taille de l'entreprise" })
  @IsNumber({}, { message: "La taille doit être un nombre" })
  size: number;
  
  @ApiProperty({ description: "Emplacement de l'entreprise" })
  @IsString({ message: "L'emplacement doit être une chaîne de caractères" })
  location: string;
  
  @ApiProperty({ description: "Activité de l'entreprise" })
  @IsString({ message: "L'activité doit être une chaîne de caractères" })
  activity: string;
  
  @ApiProperty({ description: "Spécialité de l'entreprise" })
  @IsString({ message: "La spécialité doit être une chaîne de caractères" })
  speciality: string;
  
  @ApiProperty({ description: "Site web de l'entreprise" })
  @IsString({ message: "Le site web doit être une chaîne de caractères" })
  website: string;
  
}