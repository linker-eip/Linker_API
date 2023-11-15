import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, maxLength } from "class-validator";

export class CreateGroupDto {
    @ApiProperty({description: "Nom du groupe" })
    @IsString({message: "Le nom du groupe doit être une chaine de caractères"})
    @MaxLength(32, {message: "Le nom du groupe ne peut pas contenir plus de 32 caractères"})
    name: string;

    @ApiProperty({ description: "Description de la mission" })
    @IsString({ message: "La description doit être une chaîne de caractères" })
    description: string;

    @ApiProperty()
    @IsString()
    picture: string;
}