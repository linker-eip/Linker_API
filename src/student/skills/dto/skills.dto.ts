import { ApiProperty } from '@nestjs/swagger';

export class SkillsDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  logo: string;
}
