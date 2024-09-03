import { ApiProperty } from '@nestjs/swagger';

export class LoginCompanyResponseDto {
  @ApiProperty()
  token: string;
}
