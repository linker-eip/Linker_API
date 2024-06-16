import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsEmail, IsNumber, IsString, isString } from 'class-validator';
import { StudentUser } from '../entity/StudentUser.entity';
import { StudentProfile } from '../entity/StudentProfile.entity';

export class StudentSearchNetworkResponseDto {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  picture: string;

  @ApiProperty()
  @IsString()
  location: string;

  @ApiProperty()
  @IsString()
  skills: string;

  @ApiProperty()
  @IsNumber()
  note: number;

  @ApiProperty()
  @IsNumber()
  tjm: number;

  @ApiProperty()
  @IsBoolean()
  isActive: boolean;

  @ApiProperty()
  hasGroup: boolean;
}

export function formatToStudentSearchNetworkResponseDto(student: StudentUser, studentProfile : StudentProfile) {
    const dto = new StudentSearchNetworkResponseDto();
    dto.id = student.id;
    dto.firstName = student.firstName;
    dto.lastName = student.lastName;
    dto.picture = studentProfile.picture;
    dto.description = studentProfile.description;
    dto.location = studentProfile.location;
    dto.skills = studentProfile.skills;
    dto.note = studentProfile.note;
    dto.tjm = studentProfile.tjm;
    dto.isActive = student.isActive;
    dto.hasGroup = student.groupId !== null;
    return dto;
  }