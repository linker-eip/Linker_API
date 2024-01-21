import { ApiProperty } from '@nestjs/swagger';

export class SkillsDto {

  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  logo: string;
}
