import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ description: "Token de l'utilisateur" })
  @IsString({ message: 'Le token doit être une chaîne de caractères' })
  token: string;

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
}

export class ChangePasswordDto {
  @ApiProperty({ description: "Ancien mot de passe de l'utilisateur" })
  @IsNotEmpty({ message: "L'ancien mot de passe ne doit pas être vide" })
  @IsString({
    message: "L'ancien mot de passe doit être une chaîne de caractères",
  })
  @IsDefined({ message: "L'ancien mot de passe doit être défini" })
  oldPassword: string;

  @ApiProperty({ description: "Nouveau mot de passe de l'utilisateur" })
  @IsNotEmpty({ message: 'Le mot de passe ne doit pas être vide' })
  @IsString({ message: 'Le mot de passe doit être une chaîne de caractères' })
  @IsDefined({ message: 'Le mot de passe doit être défini' })
  @MinLength(8, {
    message: 'Le mot de passe doit contenir au moins 8 caractères',
  })
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {
    message: 'Le mot de passe est trop faible',
  })
  newPassword: string;
}
