import { Module } from '@nestjs/common';
import { Contact } from './entity/contact.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactAdminService } from './contact.admin.service';
import { ContactAdminController } from './contact.admin.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Contact])],
  providers: [ContactAdminService],
  controllers: [ContactAdminController],
})
export class ContactAdminModule {}
