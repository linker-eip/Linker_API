import { Injectable } from '@nestjs/common';
import { Jobs } from './entity/jobs.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentProfile } from '../entity/StudentProfile.entity';

@Injectable()
export class JobsService {

    constructor(
        @InjectRepository(Jobs)
        private jobsRepository: Repository<Jobs>,
      ) {}
    
      async addJob(studentProfile : StudentProfile, jobs: Jobs) {
        const job = new Jobs();
        job.name = jobs.name;
        job.logo = jobs.logo;
        job.city = jobs.city;
        job.duration = jobs.duration;
        job.description = jobs.description;
        job.studentProfile = studentProfile;
        return this.jobsRepository.save(job);
      }
    
      async findJobs(studentProfileId: number): Promise<Jobs[]> {
        return this.jobsRepository.find({
          where: { studentProfile: { id: studentProfileId } },
        });
      }
}
