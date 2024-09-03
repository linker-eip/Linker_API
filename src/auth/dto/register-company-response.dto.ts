import { ApiProperty } from '@nestjs/swagger';

export class RegisterCompanyResponseDto {
  @ApiProperty()
  token: string;
}
