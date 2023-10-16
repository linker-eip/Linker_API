import { ConflictException, Injectable } from '@nestjs/common';
import { Skills } from './entity/skills.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentProfile } from '../entity/StudentProfile.entity';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skills)
    private skillsRepository: Repository<Skills>,
  ) {}

  async addSkill(studentProfile: StudentProfile, skills: Skills) {
    const skill = new Skills();
    skill.name = skills.name;
    skill.logo = skills.logo;
    skill.studentProfile = studentProfile;

    const existingSkill = await this.skillsRepository.findOne({
      where: { name: skill.name, studentProfile: { id: studentProfile.id } },
    });
    if (!existingSkill) {
      return this.skillsRepository.save(skill);
    }
  }

  async findSkills(studentProfileId: number): Promise<Skills[]> {
    return this.skillsRepository.find({
      where: { studentProfile: { id: studentProfileId } },
    });
  }
}
