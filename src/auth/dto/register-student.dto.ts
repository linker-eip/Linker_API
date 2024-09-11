import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsDefined,
  MinLength,
  Matches,
} from 'class-validator';

export class RegisterStudentDto {
  @ApiProperty({ description: "Adresse email de l'utilisateur" })
  @IsEmail({}, { message: "L'email doit être une adresse email valide" })
  @IsNotEmpty({ message: "L'email ne doit pas être vide" })
  @IsString({ message: "L'email doit être une chaîne de caractères" })
  @IsDefined({ message: "L'email doit être défini" })
  email: string;

  @ApiProperty({ description: "Mot de passe de l'utilisateur" })
  @IsNotEmpty({ message: 'Le mot de passe ne doit pas être vide' })
  @IsString({ message: 'Le mot de passe doit être une chaîne de caractères' })
  @IsDefined({ message: 'Le mot de passe doit être défini' })
  @MinLength(8, {
    message: 'Le mot de passe doit contenir au moins 8 caractères',
  })
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {
    message: 'Le mot de passe est trop faible',
  })
  password: string;

  @ApiProperty({ description: "Prénom de l'utilisateur" })
  @IsNotEmpty({ message: 'Le prénom ne doit pas être vide' })
  @IsString({ message: 'Le prénom doit être une chaîne de caractères' })
  @IsDefined({ message: 'Le prénom doit être défini' })
  firstName: string;

  @ApiProperty({ description: "Nom de famille de l'utilisateur" })
  @IsNotEmpty({ message: 'Le nom de famille ne doit pas être vide' })
  @IsString({ message: 'Le nom de famille doit être une chaîne de caractères' })
  @IsDefined({ message: 'Le nom de famille doit être défini' })
  lastName: string;
}
