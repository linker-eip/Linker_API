import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsDefined,
  MinLength,
  Matches,
} from 'class-validator';

export class RegisterCompanyAdminDto {
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
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {
    message: 'Too weak password',
  })
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsDefined()
  companyName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsDefined()
  phoneNumber: string;
}
