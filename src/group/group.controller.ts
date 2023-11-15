import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group-dto';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
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
        return await this.groupService.createGroup(req, createGroupDto)
    }
}
