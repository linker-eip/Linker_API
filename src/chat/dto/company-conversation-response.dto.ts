export class CompanyChannelInfoDto {
  id: number;
  groupId: number;
  name: string;
  logo: string;
}

export class CompanyConversationResponseDto {
  missionChannels: CompanyChannelInfoDto[];
  premissionChannels: CompanyChannelInfoDto[];
}
