import { Module } from '@nestjs/common';
import { MissionService } from './mission.service';
import { MissionController } from './mission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mission } from './entity/mission.entity';
import { CompanyModule } from '../company/company.module';

@Module({
  imports: [TypeOrmModule.forFeature([Mission]), CompanyModule],
  providers: [MissionService],
  controllers: [MissionController],
  exports: [MissionService]
})
export class MissionModule {}
