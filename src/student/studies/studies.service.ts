import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Studies } from './entity/studies.entity';
import { Repository } from 'typeorm';
import { StudentProfile } from '../entity/StudentProfile.entity';

@Injectable()
export class StudiesService {

    constructor(
        @InjectRepository(Studies)
        private studiesRepository: Repository<Studies>,
      ) {}
    
      async addStudie(studentProfile : StudentProfile, studies: Studies) {
        const studie = new Studies();
        studie.name = studies.name;
        studie.logo = studies.logo;
        studie.city = studies.city;
        studie.duration = studies.duration;
        studie.description = studies.description;
        studie.studentProfile = studentProfile;
        return this.studiesRepository.save(studie);
      }
    
      async findStudies(studentProfileId: number): Promise<Studies[]> {
        return this.studiesRepository.find({
          where: { studentProfile: { id: studentProfileId } },
        });
      }
}
