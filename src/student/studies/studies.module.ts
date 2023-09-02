import { Module } from '@nestjs/common';
import { StudiesService } from './studies.service';
import { StudiesController } from './studies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Studies } from './entity/studies.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Studies])],
  providers: [StudiesService],
  controllers: [StudiesController],
  exports: [StudiesService]
})
export class StudiesModule {}
