import { ApiProperty } from '@nestjs/swagger';

export class CompanyChannelInfoDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  groupId: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  logo: string;
}

export class CompanyConversationResponseDto {
  @ApiProperty({ type: CompanyChannelInfoDto, isArray: true })
  missionChannels: CompanyChannelInfoDto[];
  @ApiProperty({ type: CompanyChannelInfoDto, isArray: true })
  premissionChannels: CompanyChannelInfoDto[];
}
