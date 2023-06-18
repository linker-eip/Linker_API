import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyUser } from 'src/entity/CompanyUser.entity';
import { CompanyProfile } from 'src/entity/CompanyProfile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyUser, CompanyProfile])],
  providers: [CompanyService],
  controllers: [CompanyController],
  exports: [CompanyService],
})
export class CompanyModule {}
