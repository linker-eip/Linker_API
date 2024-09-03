import { ApiProperty } from '@nestjs/swagger';
import { MissionInviteStatus } from '../enum/mission-invite-status.enum';
import { IsEnum } from 'class-validator';

export class GetMissionDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  companyId: number;

  @ApiProperty()
  groupId: number;

  @ApiProperty()
  startOfMission: Date;

  @ApiProperty()
  endOfMission: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  skills: string;
}

export class getInvitedGroups {
  @ApiProperty()
  groupId: number;

  @ApiProperty()
  groupName: string;

  @ApiProperty({ enum: MissionInviteStatus })
  invitedStatus: MissionInviteStatus;
}
