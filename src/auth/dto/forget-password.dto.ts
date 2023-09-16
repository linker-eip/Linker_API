import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class ForgetPasswordDto {
    @ApiProperty({ description: "Adresse email de l'utilisateur" })
    @IsEmail({}, { message: "L'email doit être une adresse email valide" })
    @IsString({ message: "L'email doit être une chaîne de caractères" })
    email: string;
}