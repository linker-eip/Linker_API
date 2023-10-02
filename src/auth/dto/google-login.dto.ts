import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class GoogleLoginDto {
  @ApiProperty()
  @IsNotEmpty()
  code: string;
}

export class GoogleLoginTokenDto {
  @ApiProperty()
  @IsNotEmpty()
  token: string;
}
