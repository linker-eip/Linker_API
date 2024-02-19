import { Module } from '@nestjs/common';
import { SkillsService } from './skills.service';
import { Skills } from './entity/skills.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkillsController } from './skills.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Skills])],
  controllers: [SkillsController],
  providers: [SkillsService],
  exports: [SkillsService],
})
export class SkillsModule {}
