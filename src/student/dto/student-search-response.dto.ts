import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNumber,
  IsString,
} from 'class-validator';
import { StudentUser } from '../entity/StudentUser.entity';

export class StudentSearchResponseDto {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsString()
  picture: string;
}

export function formatToStudentSearchResponseDto(
  student: StudentUser,
  picture: string | null,
) {
  const dto = new StudentSearchResponseDto();
  dto.id = student.id;
  dto.email = student.email;
  dto.firstName = student.firstName;
  dto.lastName = student.lastName;
  dto.picture = picture;
  return dto;
}
