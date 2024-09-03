import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group-dto';
import { UpdateGroupDto } from './dto/update-group-dto';
import { GetGroupeResponse } from './dto/get-group-response-dto';
import {
  GetInvitesResponse,
  GetPersonnalInvitesResponse,
} from './dto/get-invites-response-dto';
import { GetCompanySearchGroupsDto } from './dto/get-company-search-groups.dto';
import { CompanySearchGroupsFilterDto } from './dto/company-search-groups-filter.dto';
import { VerifiedUserGuard } from '../admin/auth/guard/user.guard';

@ApiBearerAuth()
@UseGuards(VerifiedUserGuard)
@ApiTags('Group')
@Controller('api/group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  @ApiOperation({
    description: 'Create a group as a student',
    summary: 'Create a group as a student',
  })
  async createGroup(@Req() req, @Body() createGroupDto: CreateGroupDto) {
    return await this.groupService.createGroup(req, createGroupDto);
  }

  @Put()
  @ApiOperation({
    description: 'Update a group',
    summary: 'Update a group',
  })
  async updateGroup(@Req() req, @Body() updateGroupDto: UpdateGroupDto) {
    return await this.groupService.updateGroup(req, updateGroupDto);
  }

  @Delete()
  @ApiOperation({
    description: 'Delete a group',
    summary: 'Delete a group',
  })
  async deleteGroup(@Req() req) {
    return await this.groupService.deleteGroup(req);
  }

  @Get()
  @ApiOperation({
    description: 'Get your group',
    summary: 'Get your group',
  })
  @ApiResponse({
    status: 200,
    description: 'Group found',
    type: GetGroupeResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Group not found',
  })
  async getGroup(@Req() req): Promise<GetGroupeResponse> {
    return await this.groupService.getGroup(req);
  }

  @Post('/invite/:userId')
  @ApiOperation({
    description: 'Invite user to your group',
    summary: 'Invite user to your group',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully invited',
  })
  @ApiResponse({
    status: 404,
    description: 'Unknown user',
  })
  @ApiResponse({
    status: 409,
    description: 'User already has a group',
  })
  @ApiResponse({
    status: 400,
    description: 'You are not the group leader',
  })
  async inviteUser(@Req() req, @Param('userId') userId: number) {
    return await this.groupService.inviteUser(req, userId);
  }

  @Delete('/invite/:userId')
  @ApiOperation({
    description: 'Cancel user invitation',
    summary: 'Cancel user invitation',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully cancelled',
  })
  @ApiResponse({
    status: 400,
    description: 'You are not the group leader',
  })
  async cancelInvite(@Req() req, @Param('userId') userId: number) {
    return await this.groupService.cancelInvite(req, userId);
  }

  @Get('/groupInvites')
  @ApiOperation({
    description: 'Get invited users ids',
    summary: 'Get invited users ids',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully got invites',
    type: GetPersonnalInvitesResponse,
    isArray: true,
  })
  @ApiResponse({
    status: 400,
    description: 'You are not the group leader',
  })
  async getGroupInvites(@Req() req): Promise<GetPersonnalInvitesResponse[]> {
    return await this.groupService.getGroupInvites(req);
  }

  @Get('/invites')
  @ApiOperation({
    description: 'Get group that invited you',
    summary: 'Get group that invited you',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully got invites',
    type: GetInvitesResponse,
    isArray: true,
  })
  async getInvites(@Req() req): Promise<GetInvitesResponse[]> {
    return await this.groupService.getInvites(req);
  }

  @Post('/invites/accept/:groupId')
  @ApiOperation({
    description: 'Accept group invitation from its id',
    summary: 'Accept group invitation from its id',
  })
  async acceptInvite(@Req() req, @Param('groupId') groupId: number) {
    return await this.groupService.acceptInvite(req, groupId);
  }

  @Post('/invites/refuse/:groupId')
  @ApiOperation({
    description: 'Accept group invitation from its id',
    summary: 'Accept group invitation from its id',
  })
  async refuseInvite(@Req() req, @Param('groupId') groupId: number) {
    return await this.groupService.refuseInvite(req, groupId);
  }

  @Delete('/leave')
  @ApiOperation({
    description: 'Leave your group (not possible as a leader)',
    summary: 'Leave your group (not possible as a leader)',
  })
  async leaveGroup(@Req() req) {
    return await this.groupService.leaveGroup(req);
  }

  @Delete('/eject/:userId')
  @ApiOperation({
    description: 'Eject member from your group (only possible as a leader)',
    summary: 'Eject member from your group (only possible as a leader)',
  })
  @ApiResponse({
    status: 200,
    description: 'Membre éjecté',
  })
  @ApiResponse({
    status: 409,
    description: 'Mission en cours',
  })
  @ApiResponse({
    status: 403,
    description: 'Vous devez être chef de groupe',
  })
  @ApiResponse({
    status: 400,
    description: "Vous n'avez pas de groupe",
  })
  async ejectMember(@Req() req, @Param('userId') userId) {
    return await this.groupService.ejectMember(req, userId);
  }

  @Post('/transfer/:userId')
  @ApiOperation({
    description: 'Transfer group leadership',
    summary: 'Transfer group leadership',
  })
  @ApiResponse({
    status: 200,
    description: 'Leadership transferred',
  })
  @ApiResponse({
    status: 409,
    description: 'Mission en cours',
  })
  @ApiResponse({
    status: 403,
    description: 'Vous devez être chef de groupe',
  })
  @ApiResponse({
    status: 400,
    description: "Vous n'avez pas de groupe",
  })
  async transferLeadership(@Req() req, @Param('userId') userId: number) {
    return await this.groupService.transferLeadership(req, userId);
  }

  @Get('/company/searchGroups')
  @ApiOperation({
    description: 'Get all groups',
    summary: 'Get all groups',
  })
  @ApiResponse({
    status: 200,
    description: 'Groups found',
    type: GetCompanySearchGroupsDto,
    isArray: true,
  })
  async getAllGroups(
    @Query() searchOption: CompanySearchGroupsFilterDto,
    @Req() req,
  ): Promise<GetCompanySearchGroupsDto[]> {
    return await this.groupService.getAllGroups(req, searchOption);
  }
}
