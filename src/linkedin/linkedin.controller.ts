import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LinkedinService } from './linkedin.service';
import { LinkedinDto } from './dto/Linkedin.dto';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('LinkedIn')
@Controller('api/linkedin')
export class LinkedinController {
    constructor(private readonly linkedinService: LinkedinService) { }

    @Post()
    async getProfile(@Req() req, @Body() body: LinkedinDto) {
        return await this.linkedinService.findProfile(req, body.url)
    }
}
