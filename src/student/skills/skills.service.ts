import { ConflictException, Injectable } from '@nestjs/common';
import { Skills } from './entity/skills.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentProfile } from '../entity/StudentProfile.entity';
import { UpdateSkillDto } from './dto/update-skill.dto';

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

  async updateSkill(skillId: number, body: UpdateSkillDto): Promise<Skills> {
    const skillExists = await this.skillsRepository.findOne({
      where: { id: skillId },
    });
    if (!skillExists) {
      throw new ConflictException('Skill does not exist');
    }

    const skill = await this.skillsRepository.findOne({
      where: { id: skillId },
    });
    skill.name = body.name;
    skill.logo = body.logo;
    return this.skillsRepository.save(skill);
  }

  async findSkillById(skillId: number): Promise<Skills> {
    return this.skillsRepository.findOne({
      where: { id: skillId },
    });
  }

}
