import {
  HttpException,
  HttpStatus,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Mission } from './entity/mission.entity';
import { Repository } from 'typeorm';
import { CreateMissionDto } from './dto/create-mission-dto';
import { CompanyService } from '../company/company.service';
import { UpdateMissionDto } from './dto/update-mission-dto';
import { CreateMissionTaskDto } from './dto/create-mission-task.dto';
import { MissionTask } from './entity/mission-task.entity';
import { UpdateMissionTaskDto } from './dto/update-mission-task.dto';

@Injectable()
export class MissionService {
  constructor(
    @InjectRepository(Mission)
    private readonly missionRepository: Repository<Mission>,
    private readonly companyService: CompanyService,
    @InjectRepository(MissionTask)
    private readonly missionTaskRepository: Repository<MissionTask>,
  ) {}

  async findMissionById(missionId: number): Promise<Mission> {
    const mission = await this.missionRepository.findOne({
      where: { id: missionId },
    });

    return mission;
  }

  async findAllByCompanyId(companyId: number) {
    const missions = await this.missionRepository.find({
      where: { companyId },
    });

    return missions;
  }

  async createMission(createMissionDto: CreateMissionDto, req: any) {
    let company = null;
    try {
      company = await this.companyService.findOne(req.user.email);
    } catch (err) {
      throw new HttpException('Invalid company', HttpStatus.UNAUTHORIZED);
    }

    const mission = new Mission();
    mission.name = createMissionDto.name;
    mission.description = createMissionDto.description;
    mission.startOfMission = createMissionDto.startOfMission;
    mission.endOfMission = createMissionDto.endOfMission;
    mission.amount = createMissionDto.amount;
    mission.companyId = company.id;
    mission.skills = createMissionDto.skills;

    return await this.missionRepository.save(mission);
  }

  async deleteMission(missionId: number, req: any) {
    let company = null;
    try {
      company = await this.companyService.findOne(req.user.email);
    } catch (err) {
      throw new HttpException('Invalid company', HttpStatus.UNAUTHORIZED);
    }

    const mission = await this.findMissionById(missionId);

    if (mission == null || mission.companyId != company.id) {
      throw new HttpException('Invalid mission', HttpStatus.NOT_FOUND);
    }

    return this.missionRepository.delete(mission.id);
  }

  async updateMission(
    missionId: number,
    updateMissionDto: UpdateMissionDto,
    req: any,
  ) {
    let company = null;
    try {
      company = await this.companyService.findOne(req.user.email);
    } catch (err) {
      throw new HttpException('Invalid company', HttpStatus.UNAUTHORIZED);
    }

    const mission = await this.findMissionById(missionId);

    if (mission == null || mission.companyId != company.id) {
      throw new HttpException('Invalid mission', HttpStatus.NOT_FOUND);
    }

    const update: Partial<Mission> = {};
    if (updateMissionDto.name !== null) {
      update.name = updateMissionDto.name;
    }

    if (updateMissionDto.description !== null) {
      update.description = updateMissionDto.description;
    }

    if (updateMissionDto.startOfMission !== null) {
      update.startOfMission = updateMissionDto.startOfMission;
    }

    if (updateMissionDto.endOfMission !== null) {
      update.endOfMission = updateMissionDto.endOfMission;
    }

    if (updateMissionDto.amount !== null) {
      update.amount = updateMissionDto.amount;
    }

    if (updateMissionDto.skills !== null) {
      update.skills = updateMissionDto.skills;
    }

    await this.missionRepository.update(mission.id, update);
    return await this.findMissionById(missionId);
  }

  async getCompanyMissions(req: any) {
    let company = null;
    try {
      company = await this.companyService.findOne(req.user.email);
    } catch (err) {
      throw new HttpException('Invalid company', HttpStatus.UNAUTHORIZED);
    }
    if (company == null) {
      throw new HttpException('Invalid company', HttpStatus.UNAUTHORIZED);
    }
    return this.findAllByCompanyId(company.id);
  }

  async createMissionTask(
    missionId: number,
    createMissionTaskDto: CreateMissionTaskDto,
    req: any,
  ) {
    let company = null;
    try {
      company = await this.companyService.findOne(req.user.email);
    } catch (err) {
      throw new HttpException('Invalid company', HttpStatus.UNAUTHORIZED);
    }

    const mission = await this.findMissionById(missionId);

    if (mission == null || mission.companyId != company.id) {
      throw new HttpException('Invalid mission', HttpStatus.NOT_FOUND);
    }

    const missionTask = new MissionTask();
    missionTask.name = createMissionTaskDto.name;
    missionTask.description = createMissionTaskDto.description;
    missionTask.studentId = createMissionTaskDto.studentId;
    missionTask.missionId = missionId;
    missionTask.amount = createMissionTaskDto.amount;
    missionTask.skills = createMissionTaskDto.skills;

    return await this.missionTaskRepository.save(missionTask);
  }

  async updateMissionTask(
    taskId: number,
    createMissionTaskDto: UpdateMissionTaskDto,
    req: any,
  ) {
    let company = null;
    try {
      company = await this.companyService.findOne(req.user.email);
    } catch (err) {
      throw new HttpException('Invalid company', HttpStatus.UNAUTHORIZED);
    }

    const missionTask = await this.missionTaskRepository.findOne({
      where: { id: taskId },
    });

    const mission = await this.findMissionById(missionTask.missionId);

    if (mission == null || mission.companyId != company.id) {
      throw new HttpException('Invalid mission', HttpStatus.NOT_FOUND);
    }

    if (missionTask == null) {
      throw new HttpException('Invalid mission task', HttpStatus.NOT_FOUND);
    }

    const update: Partial<MissionTask> = {};
    if (createMissionTaskDto.name !== null) {
      update.name = createMissionTaskDto.name;
    }

    if (createMissionTaskDto.description !== null) {
      update.description = createMissionTaskDto.description;
    }

    if (createMissionTaskDto.studentId !== null) {
      update.studentId = createMissionTaskDto.studentId;
    }

    if (createMissionTaskDto.status !== null) {
      update.status = createMissionTaskDto.status;
    }

    if (createMissionTaskDto.amount !== null) {
      update.amount = createMissionTaskDto.amount;
    }

    if (createMissionTaskDto.skills !== null) {
      update.skills = createMissionTaskDto.skills;
    }

    await this.missionTaskRepository.update(missionTask.id, update);
    return await this.missionTaskRepository.findOne({
      where: { id: taskId },
    });
  }

  async deleteMissionTask(taskId: number, req: any) {
    let company = null;
    try {
      company = await this.companyService.findOne(req.user.email);
    } catch (err) {
      throw new HttpException('Invalid company', HttpStatus.UNAUTHORIZED);
    }

    const missionTask = await this.missionTaskRepository.findOne({
      where: { id: taskId },
    });

    if (missionTask == null) {
      throw new HttpException('Invalid mission task', HttpStatus.NOT_FOUND);
    }

    const mission = await this.findMissionById(missionTask.missionId);

    if (mission == null || mission.companyId != company.id) {
      throw new HttpException('Invalid mission', HttpStatus.NOT_FOUND);
    }

    return await this.missionTaskRepository.delete(missionTask.id);
  }

  async getMissionTasks(missionId: number, req: any) {
    let company = null;
    try {
      company = await this.companyService.findOne(req.user.email);
    } catch (err) {
      throw new HttpException('Invalid company', HttpStatus.UNAUTHORIZED);
    }

    if (typeof missionId !== 'number' || isNaN(missionId)) {
      throw new HttpException(
        'Invalid missionId. Please provide a valid number',
        HttpStatus.BAD_REQUEST,
      );
    }

    const mission = await this.findMissionById(missionId);

    if (mission == null || mission.companyId != company.id) {
      throw new HttpException('Invalid mission', HttpStatus.NOT_FOUND);
    }

    return await this.missionTaskRepository.find({
      where: { missionId },
    });
  }
}
