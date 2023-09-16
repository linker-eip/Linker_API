import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, IsDefined, MinLength, Matches } from "class-validator";

export class RegisterCompanyDto {
  @ApiProperty({ description: "Adresse email de l'utilisateur" })
  @IsEmail({}, { message: "L'email doit être une adresse email valide" })
  @IsNotEmpty({ message: "L'email ne doit pas être vide" })
  @IsString({ message: "L'email doit être une chaîne de caractères" })
  @IsDefined({ message: "L'email doit être défini" })
  email: string;
  
  @ApiProperty({ description: "Mot de passe de l'utilisateur" })
  @IsNotEmpty({ message: "Le mot de passe ne doit pas être vide" })
  @IsString({ message: "Le mot de passe doit être une chaîne de caractères" })
  @IsDefined({ message: "Le mot de passe doit être défini" })
  @MinLength(8, { message: "Le mot de passe doit contenir au moins 8 caractères" })
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {
    message: 'Le mot de passe est trop faible',
  })
  password: string;
  
  @ApiProperty({ description: "Nom de l'utilisateur" })
  @IsNotEmpty({ message: "Le nom ne doit pas être vide" })
  @IsString({ message: "Le nom doit être une chaîne de caractères" })
  @IsDefined({ message: "Le nom doit être défini" })
  name: string;
  
  @ApiProperty({ description: "Numéro de téléphone de l'utilisateur" })
  @IsNotEmpty({ message: "Le numéro de téléphone ne doit pas être vide" })
  @IsString({ message: "Le numéro de téléphone doit être une chaîne de caractères" })
  @IsDefined({ message: "Le numéro de téléphone doit être défini" })
  phoneNumber: string;
  
}