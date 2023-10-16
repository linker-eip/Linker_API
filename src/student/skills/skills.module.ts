import { Module } from '@nestjs/common';
import { SkillsService } from './skills.service';
import { Skills } from './entity/skills.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Skills])],
  controllers: [],
  providers: [SkillsService],
  exports: [SkillsService],
})
export class SkillsModule {}
