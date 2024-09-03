import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsDefined,
  MinLength,
} from 'class-validator';

export class LoginStudentDto {
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
  password: string;
}
