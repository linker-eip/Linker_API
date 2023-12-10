import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GroupService } from './group.service';
import { CreateGroupDto } from './get-invites-response-dto.ts/create-group-dto';
import { UpdateGroupDto } from './get-invites-response-dto.ts/update-group-dto';
import { GetGroupeResponse } from './get-invites-response-dto.ts/get-group-response-dto';
import { GetInvitesResponse } from './dto/get-invites-response-dto';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Group')
@Controller('api/group')
export class GroupController {
    constructor(private readonly groupService: GroupService) { }

    @Post()
    @ApiOperation({
        description: 'Create a group as a student',
        summary: 'Create a group as a student',
    })
    async createGroup(@Req() req, @Body() createGroupDto: CreateGroupDto) {
        return await this.groupService.createGroup(req, createGroupDto)
    }

    @Put()
    @ApiOperation({
        description: 'Update a group',
        summary: 'Update a group',
    })
    async updateGroup(
        @Req() req,
        @Body() updateGroupDto: UpdateGroupDto,
    ) {
        return await this.groupService.updateGroup(req, updateGroupDto)
    }

    @Delete()
    @ApiOperation({
        description: 'Delete a group',
        summary: 'Delete a group',
    })
    async deleteGroup(
        @Req() req
    ) {
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
        type: GetGroupeResponse
    })
    @ApiResponse({
        status: 404,
        description: 'Group not found',
    })
    async getGroup(
        @Req() req
    ): Promise<GetGroupeResponse> {
        return await this.groupService.getGroup(req);
    }

    @Get('/invite/:userId')
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
    })
    @ApiResponse({
        status: 400,
        description: 'You are not the group leader',
    })
    async getGroupInvites(@Req() req): Promise<number[]> {
        return await this.groupService.getGroupInvites(req);
    }

    @Get('/invites')
    @ApiOperation({
        description: 'Get group that invited you ids',
        summary: 'Get group that invited you ids',
    })
    @ApiResponse({
        status: 200,
        description: 'Successfully got invites',
    })
    async getInvites(@Req() req): Promise<GetInvitesResponse[]> {
        return await this.groupService.getInvites(req);
    }
}
