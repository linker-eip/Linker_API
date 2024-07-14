import { ApiProperty } from '@nestjs/swagger';

export class ChannelInfoDto {
 @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  logo: string;
}

export class StudentConversationResponseDto {
  @ApiProperty({type: ChannelInfoDto})
  groupChannel: ChannelInfoDto;
  @ApiProperty({type: ChannelInfoDto, isArray: true})
  missionChannels: ChannelInfoDto[];
  @ApiProperty({type: ChannelInfoDto, isArray: true})
  premissionChannels: ChannelInfoDto[];
  @ApiProperty({type: ChannelInfoDto, isArray: true})
  dmChannels: ChannelInfoDto[];
}
