import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Studies } from './entity/studies.entity';
import { Repository } from 'typeorm';
import { StudentProfile } from '../entity/StudentProfile.entity';
import { UpdateStudiesDto } from './dto/update-studies.dto';

@Injectable()
export class StudiesService {
  constructor(
    @InjectRepository(Studies)
    private studiesRepository: Repository<Studies>,
  ) {}

  async addStudie(studentProfile: StudentProfile, studies: Studies) {
    const studie = new Studies();
    studie.name = studies.name;
    studie.position = studies.position;
    studie.logo = studies.logo;
    studie.city = studies.city;
    studie.duration = studies.duration;
    studie.description = studies.description;
    studie.studentProfile = studentProfile;

    const existingStudie = await this.studiesRepository.findOne({
      where: {
        name: studie.name,
        position: studie.position,
        city: studie.city,
        duration: studie.duration,
        description: studie.description,
        studentProfile: { id: studentProfile.id },
      },
    });
    if (!existingStudie) {
      return this.studiesRepository.save(studie);
    }
  }

  async findStudies(studentProfileId: number): Promise<Studies[]> {
    return this.studiesRepository.find({
      where: { studentProfile: { id: studentProfileId } },
    });
  }

  async findStudieById(id: number): Promise<Studies> {
    return this.studiesRepository.findOne({ where: { id } });
  }

  async updateStudie(id: number, studies: UpdateStudiesDto): Promise<Studies> {
    const studie = await this.findStudieById(id);
    studie.name = studies.name;
    studie.logo = studies.logo;
    studie.city = studies.city;
    studie.duration = studies.duration;
    studie.description = studies.description;

    return this.studiesRepository.save(studie);
  }

  async deleteStudie(id: number) {
    const studie = await this.findStudieById(id);
    return this.studiesRepository.remove(studie);
  }
}
