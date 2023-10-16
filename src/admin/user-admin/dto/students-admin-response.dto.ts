import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsEmail, IsNumber, IsString } from 'class-validator';
import { StudentUser } from '../../../student/entity/StudentUser.entity';

export class StudentAdminResponseDto {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  FirstName: string;

  @ApiProperty()
  @IsString()
  LastName: string;

  @ApiProperty()
  @IsString()
  picture: string;

  @ApiProperty()
  @IsBoolean()
  isActive: boolean;

  @ApiProperty()
  @IsDate()
  lastConnectedAt: Date;

  @ApiProperty()
  @IsDate()
  createdAt: Date;
}

export function formatToStudentAdminResponseDto(student: StudentUser) {
  const dto = new StudentAdminResponseDto();
  dto.id = student.id;
  dto.email = student.email;
  dto.FirstName = student.firstName;
  dto.LastName = student.lastName;
  dto.picture = student.picture;
  dto.isActive = student.isActive;
  dto.lastConnectedAt = student.lastConnectedAt;
  dto.createdAt = student.createdAt;
  return dto;
}