import { ConflictException, Injectable } from '@nestjs/common';
import { Jobs } from './entity/jobs.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentProfile } from '../entity/StudentProfile.entity';
import { UpdateJobsDto } from './dto/update-jobs.dto';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Jobs)
    private jobsRepository: Repository<Jobs>,
  ) {}

  async addJob(studentProfile: StudentProfile, jobs: Jobs) {
    const job = new Jobs();
    job.name = jobs.name;
    job.position = jobs.position;
    job.logo = jobs.logo;
    job.city = jobs.city;
    job.duration = jobs.duration;
    job.description = jobs.description;
    job.studentProfile = studentProfile;

    const existingJob = await this.jobsRepository.findOne({
      where: {
        name: job.name,
        position: job.position,
        city: job.city,
        duration: job.duration,
        description: job.description,
        studentProfile: { id: studentProfile.id },
      },
    });
    if (!existingJob) {
      return this.jobsRepository.save(job);
    }
  }

  async findJobs(studentProfileId: number): Promise<Jobs[]> {
    return this.jobsRepository.find({
      where: { studentProfile: { id: studentProfileId } },
    });
  }

  async findJobById(id: number): Promise<Jobs> {
    return this.jobsRepository.findOne({ where: { id } });
  }

  async updateJob(id: number, jobs: UpdateJobsDto): Promise<Jobs> {
    const job = await this.findJobById(id);
    job.name = jobs.name;
    job.logo = jobs.logo;
    job.city = jobs.city;
    job.duration = jobs.duration;
    job.description = jobs.description;

    return this.jobsRepository.save(job);
  }

  async deleteJob(id: number) {
    const job = await this.findJobById(id);
    return this.jobsRepository.remove(job);
  }
}
