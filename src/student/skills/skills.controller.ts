import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SkillsService } from './skills.service';
import { SkillList } from './consts/skills-list';
import { VerifiedUserGuard } from 'src/admin/auth/guard/user.guard';

@Controller('api/skills')
@UseGuards(VerifiedUserGuard)
@ApiTags('Skills')
@ApiBearerAuth()
export class SkillsController {
    constructor(private readonly skillsService: SkillsService) {}

    @Get('list')
    @ApiOperation({
    description: 'Get skills list',
    summary: 'Get skills list',
    })
    async getSkillsList(@Req() req) {
        return SkillList;
    }
}
