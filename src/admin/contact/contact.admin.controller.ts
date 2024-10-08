import { Body, Controller, Delete, Get, Param, Put, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ContactAdminService } from './contact.admin.service';
import { UpdateContactDto } from './dto/update-contact.dto';
import { AdminGuard } from '../guards/admin/admin.guard';

@ApiTags('Admin/Contact')
@UseGuards(AdminGuard)
@Controller('api/admin/contact')
export class ContactAdminController {
  constructor(private readonly contactAdminService: ContactAdminService) {}

  @Get()
  async findAll() {
    return await this.contactAdminService.findAll();
  }

  @Put('/:id')
  async update(
    @Body() updateContactDto: UpdateContactDto,
    @Param('id') id: number,
  ) {
    return await this.contactAdminService.update(id, updateContactDto);
  }

  @Delete('/:id')
  async delete(@Param('id') id: number) {
    return await this.contactAdminService.delete(id);
  }
}
