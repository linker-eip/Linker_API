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
import { GroupService } from '../group/group.service';
import { StudentService } from '../student/student.service';
import { MissionInvite } from './entity/mission-invite.entity';
import { MissionInviteStatus } from './enum/mission-invite-status.enum';
import { MissionStatus } from './enum/mission-status.enum';
import { MissionTaskStatus } from './enum/mission-task-status.enum';
import { StudentProfileResponseDto } from '../student/dto/student-profile-response.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status-dto';
import { MissionSearchOptionStudentDto } from './dto/mission-search-option-student.dto';

@Injectable()
export class MissionService {
  constructor(
    @InjectRepository(Mission)
    private readonly missionRepository: Repository<Mission>,
    private readonly companyService: CompanyService,
    @InjectRepository(MissionTask)
    private readonly missionTaskRepository: Repository<MissionTask>,
    private readonly groupService: GroupService,
    private readonly studentService: StudentService,
    @InjectRepository(MissionInvite)
    private readonly missionInviteRepository: Repository<MissionInvite>,
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

    if (missionTask == null) {
      throw new HttpException('Invalid mission task', HttpStatus.NOT_FOUND);
    }

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

    if (company == null) {
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

  async acceptMission(missionId: number, groupId: number, req: any) {
    let missionInvite = await this.missionInviteRepository.findOne({
      where: { missionId, groupId },
    });

    if (missionInvite == null) {
      throw new HttpException('Invalid mission invite', HttpStatus.NOT_FOUND);
    }
    let student = null;
    try {
      student = await this.studentService.findOneByEmail(req.user.email);
    } catch (err) {
      throw new HttpException('Invalid student', HttpStatus.UNAUTHORIZED);
    }
    if (student == null) {
      throw new HttpException('Invalid student', HttpStatus.UNAUTHORIZED);
    }
    let mission = await this.findMissionById(missionId);
    if (mission == null) {
      throw new HttpException('Invalid mission', HttpStatus.NOT_FOUND);
    }
    let group = await this.groupService.findGroupById(groupId);
    if (group == null) {
      throw new HttpException('Invalid group', HttpStatus.NOT_FOUND);
    }

    if (group.leaderId != student.id) {
      throw new HttpException(
        'Only the group leader can accept a mission',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (mission.groupId != null) {
      throw new HttpException(
        'This mission is already accepted by a group',
        HttpStatus.BAD_REQUEST,
      );
    }

    mission.groupId = groupId;
    missionInvite.status = MissionInviteStatus.ACCEPTED;

    await this.missionRepository.save(mission);
    await this.missionInviteRepository.save(missionInvite);
    return;
  }

  async refuseMission(missionId: number, groupId: number, req: any) {
    let missionInvite = await this.missionInviteRepository.findOne({
      where: { missionId, groupId },
    });

    if (missionInvite == null) {
      throw new HttpException('Invalid mission invite', HttpStatus.NOT_FOUND);
    }

    if (missionInvite.status != MissionInviteStatus.PENDING) {
      throw new HttpException(
        'This mission invite is already accepted or refused',
        HttpStatus.BAD_REQUEST,
      );
    }

    let student = null;
    try {
      student = await this.studentService.findOneByEmail(req.user.email);
    } catch (err) {
      throw new HttpException('Invalid student', HttpStatus.UNAUTHORIZED);
    }
    if (student == null) {
      throw new HttpException('Invalid student', HttpStatus.UNAUTHORIZED);
    }
    let mission = await this.findMissionById(missionId);
    if (mission == null) {
      throw new HttpException('Invalid mission', HttpStatus.NOT_FOUND);
    }
    let group = await this.groupService.findGroupById(groupId);
    if (group == null) {
      throw new HttpException('Invalid group', HttpStatus.NOT_FOUND);
    }

    if (group.leaderId != student.id) {
      throw new HttpException(
        'Only the group leader can refuse a mission',
        HttpStatus.UNAUTHORIZED,
      );
    }

    missionInvite.status = MissionInviteStatus.REFUSED;

    await this.missionInviteRepository.save(missionInvite);
    return;
  }

  async finishMission(missionId: number, req: any) {
    let mission = await this.findMissionById(missionId);
    if (mission == null) {
      throw new HttpException('Invalid mission', HttpStatus.NOT_FOUND);
    }
    let company = null;
    try {
      company = await this.companyService.findOne(req.user.email);
    } catch (err) {
      throw new HttpException('Invalid company', HttpStatus.UNAUTHORIZED);
    }

    if (company == null) {
      throw new HttpException('Invalid company', HttpStatus.UNAUTHORIZED);
    }

    if (mission.companyId != company.id) {
      throw new HttpException(
        'You can only finish your own missions',
        HttpStatus.UNAUTHORIZED,
      );
    }

    let missionTasks = await this.missionTaskRepository.find({
      where: { missionId },
    });

    for (let missionTask of missionTasks) {
      if (missionTask.status != MissionTaskStatus.FINISHED) {
        throw new HttpException(
          'You can only finish a mission if all tasks are finished',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    if (mission.status == MissionStatus.FINISHED) {
      throw new HttpException(
        'This mission is already finished',
        HttpStatus.BAD_REQUEST,
      );
    }

    mission.status = MissionStatus.FINISHED;

    await this.missionRepository.save(mission);
  }

  async getMissionDetailsCompany(missionId: number, req: any) {
    let mission = await this.findMissionById(missionId);
    if (mission == null) {
      throw new HttpException('Invalid mission', HttpStatus.NOT_FOUND);
    }
    let company = null;
    try {
      company = await this.companyService.findOne(req.user.email);
    } catch (err) {
      throw new HttpException('Invalid company', HttpStatus.UNAUTHORIZED);
    }

    if (company == null) {
      throw new HttpException('Invalid company', HttpStatus.UNAUTHORIZED);
    }

    const companyProfile = await this.companyService.findCompanyProfile(
      company.email,
    );

    if (mission.companyId != company.id) {
      throw new HttpException(
        'You can only see details of your own missions',
        HttpStatus.UNAUTHORIZED,
      );
    }

    let missionTasks = await this.missionTaskRepository.find({
      where: { missionId },
    });

    let missionTaskArray = [];
    for (let missionTask of missionTasks) {
      if (missionTask.studentId == null) {
        missionTaskArray.push({
          missionTask,
          studentProfile: null,
        });
        continue;
      }

      let student = await this.studentService.findOneById(
        missionTask.studentId,
      );
      const studentProfile =
        await this.studentService.findStudentProfileByStudentId(student.id);
      missionTaskArray.push({
        missionTask,
        studentProfile,
      });
    }
    let group = null;
    let groupStudents = [];

    if (mission.groupId) {
      group = await this.groupService.findGroupById(mission.groupId);
      for (let studentId of group.studentIds) {
        let student = await this.studentService.findOneById(studentId);
        const studentProfile =
          await this.studentService.findStudentProfileByStudentId(student.id);
        groupStudents.push({
          studentProfile,
        });
      }
    }

    return {
      companyProfile,
      mission,
      missionTaskArray,
      group,
      groupStudents,
    };
  }

  async getMissionDetailsStudent(missionId: number, req: any) {
    let mission = await this.findMissionById(missionId);

    const studentUser = await this.studentService.findOneByEmail(
      req.user.email,
    );
    if (studentUser == null) {
      throw new HttpException('Invalid student', HttpStatus.UNAUTHORIZED);
    }

    if (mission == null) {
      throw new HttpException('Invalid mission', HttpStatus.NOT_FOUND);
    }

    const companyProfile = await this.companyService.findCompanyProfileById(
      mission.companyId,
    );

    if (mission.groupId == null) {
      throw new HttpException(
        "You can't see this mission",
        HttpStatus.BAD_REQUEST,
      );
    }

    if (mission.groupId != studentUser.groupId) {
      throw new HttpException(
        "You can't see this mission you are not in the group",
        HttpStatus.BAD_REQUEST,
      );
    }

    let groupStudents = [];
    let group = null;
    let missionTaskArray = [];
    let missionTasks = await this.missionTaskRepository.find({
      where: { missionId },
    });
    for (let missionTask of missionTasks) {
      let student = await this.studentService.findOneById(
        missionTask.studentId,
      );
      const studentProfile = [];
      if (missionTask.studentId != null) {
        studentProfile.push(
          await this.studentService.findStudentProfileByStudentId(student.id),
        );
      }
      missionTaskArray.push({
        missionTask,
        studentProfile,
      });
    }

    if (mission.groupId) {
      group = await this.groupService.findGroupById(mission.groupId);
      for (let studentId of group.studentIds) {
        if (studentId == null) {
          groupStudents.push({
            studentProfile: null,
          });
          continue;
        }
        let student = await this.studentService.findOneById(studentId);
        const studentProfile =
          await this.studentService.findStudentProfileByStudentId(student.id);
        groupStudents.push({
          studentProfile,
        });
      }
    } else {
      return {
        companyProfile,
        mission,
        missionTaskArray,
        group,
        groupStudents,
      };
    }

    group = await this.groupService.findGroupById(mission.groupId);
    if (group == null) {
      throw new HttpException('Invalid group', HttpStatus.NOT_FOUND);
    }
    let student = null;
    try {
      student = await this.studentService.findOneByEmail(req.user.email);
    } catch (err) {
      throw new HttpException('Invalid student', HttpStatus.UNAUTHORIZED);
    }
    if (student == null) {
      throw new HttpException('Invalid student', HttpStatus.UNAUTHORIZED);
    }
    let groupStudentArrayToInt = group.studentIds.map(Number);
    if (!groupStudentArrayToInt.includes(student.id)) {
      throw new HttpException(
        'You can only see details of your own missions',
        HttpStatus.UNAUTHORIZED,
      );
    }
    groupStudents = [];
    for (let studentId of group.studentIds) {
      let student = await this.studentService.findOneById(studentId);
      const studentProfile =
        await this.studentService.findStudentProfileByStudentId(student.id);
      groupStudents.push({
        studentProfile,
      });
    }

    return {
      companyProfile,
      mission,
      missionTaskArray,
      group,
      groupStudents,
    };
  }

  async affectTask(taskId: number, studentId: number, req: any) {
    let student = await this.studentService.findOneByEmail(req.user.email);
    let affectedStudent = await this.studentService.findOneById(studentId);
    let task = await this.missionTaskRepository.findOne({
      where: { id: taskId },
    });
    let group = await this.groupService.findGroupById(student.groupId);
    if (task == null) {
      throw new HttpException('Tâche invalide', HttpStatus.NOT_FOUND);
    }
    if (group == null) {
      throw new HttpException(
        "Vous n'avez pas de groupe",
        HttpStatus.BAD_REQUEST,
      );
    }
    let mission = await this.missionRepository.findOne({
      where: { id: task.missionId },
    });
    if (mission == null || mission.groupId != student.groupId) {
      throw new HttpException('Tâche invalide', HttpStatus.NOT_FOUND);
    }

    if (affectedStudent == null || student.groupId != affectedStudent.groupId) {
      throw new HttpException('Invalid student', HttpStatus.BAD_REQUEST);
    }

    if (student.id == group.leaderId || student.id == affectedStudent.id) {
      task.studentId = affectedStudent.id;
    } else {
      throw new HttpException(
        "Vous n'avez pas la permission d'affecter cette tâche",
        HttpStatus.FORBIDDEN,
      );
    }

    this.missionTaskRepository.save(task);
  }

  async updateTaskStatus(taskId: number, body: UpdateTaskStatusDto, req: any) {
    let student = await this.studentService.findOneByEmail(req.user.email);
    let task = await this.missionTaskRepository.findOne({
      where: { id: taskId },
    });
    let group = await this.groupService.findGroupById(student.groupId);
    if (task == null) {
      throw new HttpException('Tâche invalide', HttpStatus.NOT_FOUND);
    }
    if (group == null) {
      throw new HttpException(
        "Vous n'avez pas de groupe",
        HttpStatus.BAD_REQUEST,
      );
    }

    let mission = await this.missionRepository.findOne({
      where: { id: task.missionId },
    });
    if (mission == null || mission.groupId != student.groupId) {
      throw new HttpException('Tâche invalide', HttpStatus.NOT_FOUND);
    }
    if (student.id == group.leaderId || student.id == task.studentId) {
      task.status = body.status;
    } else {
      throw new HttpException(
        "Vous n'avez pas la permission de changer le statut de cette tâche",
        HttpStatus.FORBIDDEN,
      );
    }

    this.missionTaskRepository.save(task);
  }

  async getStudentMissions(
    req: any,
    searchOption: MissionSearchOptionStudentDto,
  ) {
    let student = await this.studentService.findOneByEmail(req.user.email);
    if (student == null) {
      throw new HttpException(
        "Vous n'êtes pas un étudiant",
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (student.groupId == null) {
      throw new HttpException(
        "Vous n'avez pas de groupe",
        HttpStatus.BAD_REQUEST,
      );
    }
    let missions = await this.missionRepository.find({
      where: { groupId: student.groupId },
    });
    if (searchOption.status) {
      missions = missions.filter(
        (mission) => mission.status == searchOption.status,
      );
    }
    return missions;
  }

  async inviteGroup(missionId: number, groupId: number, req: any) {
    let mission = await this.findMissionById(missionId);
    if (mission == null) {
      throw new HttpException('Mission invalide', HttpStatus.NOT_FOUND);
    }
    let company = await this.companyService.findOne(req.user.email);
    if (company == null) {
      throw new HttpException(
        "Vous n'êtes pas une entreprise",
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (mission.companyId != company.id) {
      throw new HttpException(
        'Cette mission ne vous appartient pas',
        HttpStatus.UNAUTHORIZED,
      );
    }
    let group = await this.groupService.findGroupById(groupId);
    if (group == null) {
      throw new HttpException('Groupe invalide', HttpStatus.NOT_FOUND);
    }
    if (mission.groupId != null) {
      throw new HttpException(
        'Cette mission est déjà acceptée par un groupe',
        HttpStatus.BAD_REQUEST,
      );
    }
    let missionInvite = await this.missionInviteRepository.findOne({
      where: { missionId, groupId },
    });
    if (missionInvite != null) {
      throw new HttpException(
        'Ce groupe a déjà été invité',
        HttpStatus.BAD_REQUEST,
      );
    }
    missionInvite = new MissionInvite();
    missionInvite.missionId = missionId;
    missionInvite.groupId = groupId;
    missionInvite.status = MissionInviteStatus.PENDING;
    await this.missionInviteRepository.save(missionInvite);
  }
}
