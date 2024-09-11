import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, maxLength } from 'class-validator';

export class UpdateGroupDto {
  @ApiProperty({ description: 'Nom du groupe' })
  @IsString({ message: 'Le nom du groupe doit être une chaine de caractères' })
  @MaxLength(32, {
    message: 'Le nom du groupe ne peut pas contenir plus de 32 caractères',
  })
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'Description de la mission' })
  @IsString({ message: 'La description doit être une chaîne de caractères' })
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  picture?: string;

  @ApiProperty()
  @IsOptional()
  isActive?: boolean;
}
