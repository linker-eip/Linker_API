import { ApiProperty } from '@nestjs/swagger';

export class LoginStudentResponseDto {
  @ApiProperty()
  token: string;
}
