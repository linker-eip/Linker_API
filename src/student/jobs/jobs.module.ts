import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Jobs } from './entity/jobs.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Jobs])],
  controllers: [],
  providers: [JobsService],
  exports: [JobsService]
})
export class JobsModule {}
