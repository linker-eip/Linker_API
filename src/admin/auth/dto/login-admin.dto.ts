import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsDefined,
  MinLength,
} from 'class-validator';

export class LoginAminDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  @IsDefined()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsDefined()
  @MinLength(8)
  password: string;
}
