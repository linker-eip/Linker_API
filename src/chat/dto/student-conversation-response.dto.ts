export class ChannelInfoDto {
  id: number;
  name: string;
  logo: string;
}

export class StudentConversationResponseDto {
  groupChannel: ChannelInfoDto;
  missionChannels: ChannelInfoDto[];
  premissionChannels: ChannelInfoDto[];
  dmChannels: ChannelInfoDto[];
}
