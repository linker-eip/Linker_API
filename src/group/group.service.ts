import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group-dto';
import { StudentService } from '../student/student.service';
import { Group } from './entity/Group.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  MoreThan,
  ILike,
  Brackets,
  Not,
  Repository,
  SelectQueryBuilder,
  And,
  Equal,
} from 'typeorm';
import { UpdateGroupDto } from './dto/update-group-dto';
import {
  GetGroupeResponse,
  groupMembersDto,
} from './dto/get-group-response-dto';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../notifications/entity/Notification.entity';
import { Request } from 'express';
import { GroupInvite } from './entity/GroupInvite.entity';
import {
  GetInvitesResponse,
  GetPersonnalInvitesResponse,
} from './dto/get-invites-response-dto';
import { CompanyService } from '../company/company.service';
import { GetCompanySearchGroupsDto } from './dto/get-company-search-groups.dto';
import { CompanySearchGroupsFilterDto } from './dto/company-search-groups-filter.dto';
import { Mission } from 'src/mission/entity/mission.entity';
import { MissionStatus } from 'src/mission/enum/mission-status.enum';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(GroupInvite)
    private readonly groupInviteRepository: Repository<GroupInvite>,
    @InjectRepository(Mission)
    private readonly missionRepository: Repository<Mission>,
    private readonly studentService: StudentService,
    private readonly notificationService: NotificationsService,
    private readonly CompanyService: CompanyService,
  ) {}

  async getUserGroup(req: any): Promise<Group> {
    let group;
    let student = await this.studentService.findOneByEmail(req.user.email);
    try {
      group = await this.groupRepository.findOne({
        where: { id: student.groupId },
      });
    } catch (err) {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }

    if (group == null) {
      throw new HttpException(
        "Vous n'avez pas de groupe",
        HttpStatus.NOT_FOUND,
      );
    }

    return group;
  }

  async findGroupById(groupId: number): Promise<Group> {
    const group = await this.groupRepository.findOne({
      where: { id: groupId },
    });
    return group;
  }

  async findGroupByName(name: string): Promise<Group> {
    const group = await this.groupRepository.findOne({
      where: { name: name },
    });
    return group;
  }

  async createGroup(req: any, createGroupDto: CreateGroupDto) {
    let student;
    try {
      student = await this.studentService.findOneByEmail(req.user.email);
    } catch (err) {
      throw new HttpException('Invalid student', HttpStatus.UNAUTHORIZED);
    }

    if (student.groupId != null) {
      throw new HttpException(
        'Student already has a group',
        HttpStatus.BAD_REQUEST,
      );
    }

    if ((await this.findGroupByName(createGroupDto.name)) != null) {
      throw new HttpException(
        'Il existe déjà un groupe portant ce nom',
        HttpStatus.BAD_REQUEST,
      );
    }

    const group = new Group();
    group.name = createGroupDto.name;
    group.description = createGroupDto.description;
    group.picture = createGroupDto.picture;
    group.leaderId = student.id;
    group.studentIds = [student.id];

    await this.groupRepository.save(group);
    student.groupId = group.id;
    this.studentService.save(student);

    this.notificationService.createNotification(
      'Groupe créé',
      'Le groupe ' + group.name + ' a bien été créé',
      NotificationType.GROUP,
      student.id,
    );

    return group;
  }

  async updateGroup(req: any, updateGroupDto: UpdateGroupDto) {
    let group;
    let student = await this.studentService.findOneByEmail(req.user.email);
    try {
      group = await this.groupRepository.findOne({
        where: { leaderId: student.id },
      });
    } catch (err) {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }

    if (group == null)
      throw new HttpException(
        "Vous n'êtes pas le chef d'un groupe",
        HttpStatus.BAD_REQUEST,
      );

    if (updateGroupDto.name != null) {
      group.name = updateGroupDto.name;
    }
    if (updateGroupDto.description != null) {
      group.description = updateGroupDto.description;
    }
    if (updateGroupDto.picture != null) {
      group.picture = updateGroupDto.picture;
    }
    if (updateGroupDto.isActive != null) {
      group.isActive = updateGroupDto.isActive;
    }
    await this.groupRepository.save(group);
    return await this.findGroupById(group.id);
  }

  async deleteGroup(req: any) {
    let group;
    let student = await this.studentService.findOneByEmail(req.user.email);
    try {
      group = await this.groupRepository.findOne({
        where: { leaderId: student.id },
      });
    } catch (err) {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }

    if (group == null)
      throw new HttpException(
        "Vous n'êtes pas le chef d'un groupe",
        HttpStatus.BAD_REQUEST,
      );

    group.studentIds.forEach(async (id) => {
      let student = await this.studentService.findOneById(id);
      student.groupId = null;
      this.studentService.save(student);
    });

    this.groupRepository.delete(group.id);
  }

  async getGroup(req: any): Promise<GetGroupeResponse> {
    let group;
    let student = await this.studentService.findOneByEmail(req.user.email);
    if (student.groupId == null) {
      throw new HttpException(
        "Vous n'avez pas de groupe",
        HttpStatus.NOT_FOUND,
      );
    }
    try {
      group = await this.groupRepository.findOne({
        where: { id: student.groupId },
      });
    } catch (err) {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }

    if (group == null) {
      throw new HttpException(
        "Vous n'avez pas de groupe",
        HttpStatus.NOT_FOUND,
      );
    }

    let groupMember = await this.studentService.findAllByIdIn(group.studentIds);
    let groupMemberDtos = await Promise.all(
      groupMember.map(async (it) => {
        let studentProfile = await this.studentService.findStudentProfile(
          it.email,
        );
        let dto = {
          firstName: it.firstName,
          lastName: it.lastName,
          id: it.id,
          isLeader: group.leaderId == it.id,
          picture: studentProfile.picture,
        };
        return dto;
      }),
    );

    let response: GetGroupeResponse = {
      name: group.name,
      description: group.description,
      picture: group.picture,
      members: groupMemberDtos,
      leaderId: group.leaderId,
      isLeader: group.leaderId == student.id,
      groupId: group.id,
      isActive: group.isActive,
    };
    return response;
  }

  async inviteUser(req: any, userId: number) {
    let group = await this.getUserGroup(req);
    let student = await this.studentService.findOneByEmail(req.user.email);

    if (group.leaderId != student.id) {
      throw new HttpException("Vous n'êtes pas le chef d'un groupe", 400);
    }

    let invitedStudent = await this.studentService.findOneById(userId);
    if (invitedStudent == null) {
      throw new HttpException(
        "Cet étudiant n'existe pas",
        HttpStatus.NOT_FOUND,
      );
    }

    if (invitedStudent.isActive == false) {
      throw new HttpException(
        "Cet étudiant n'est pas actif",
        HttpStatus.BAD_REQUEST,
      );
    }

    if (invitedStudent.groupId != null) {
      throw new HttpException(
        'Cet étudiant a déjà un groupe',
        HttpStatus.CONFLICT,
      );
    }

    if (
      (await this.groupInviteRepository.findOne({
        where: { userId: invitedStudent.id, groupId: group.id },
      })) != null
    ) {
      throw new HttpException(
        'Vous avez déjà invité cet étudiant',
        HttpStatus.BAD_REQUEST,
      );
    }

    let groupInvite = new GroupInvite();

    groupInvite.groupId = group.id;
    groupInvite.userId = invitedStudent.id;

    this.groupInviteRepository.save(groupInvite);
    this.notificationService.createNotification(
      'Invitation',
      'Vous avez été invité à rejoindre le groupe ' + group.name,
      NotificationType.GROUP,
      invitedStudent.id,
    );
  }

  async cancelInvite(req: any, userId: number) {
    let group = await this.getUserGroup(req);
    let student = await this.studentService.findOneByEmail(req.user.email);

    if (group.leaderId != student.id) {
      throw new HttpException("Vous n'êtes pas le chef d'un groupe", 400);
    }

    let groupInvite = await this.groupInviteRepository.findOne({
      where: { userId: userId, groupId: group.id },
    });
    if (groupInvite) {
      this.groupInviteRepository.delete(groupInvite);
    }
  }

  async getGroupInvites(req: any): Promise<GetPersonnalInvitesResponse[]> {
    let group = await this.getUserGroup(req);
    let student = await this.studentService.findOneByEmail(req.user.email);

    if (group.leaderId != student.id) {
      throw new HttpException("Vous n'êtes pas le chef d'un groupe", 400);
    }

    let groupInvites = await this.groupInviteRepository.findBy({
      groupId: group.id,
    });

    return Promise.all(
      groupInvites.map(async (it) => {
        let user = await this.studentService.findOneById(it.userId);
        let userProfile = await this.studentService.findStudentProfile(
          user.email,
        );
        let groupInviteResponse: GetPersonnalInvitesResponse = {
          id: user.id,
          name: user.firstName + ' ' + user.lastName,
          picture: userProfile.picture,
        };
        return groupInviteResponse;
      }),
    );
  }

  async getInvites(req: any): Promise<GetInvitesResponse[]> {
    let student = await this.studentService.findOneByEmail(req.user.email);
    let groupInvites = await this.groupInviteRepository.findBy({
      userId: student.id,
    });
    let groups = await Promise.all(
      groupInvites.map(async (it) => {
        let group = await this.groupRepository.findOne({
          where: { id: it.groupId },
        });
        if (group == null) {
          return;
        }
        let leader = await this.studentService.findOneById(group.leaderId);
        let response: GetInvitesResponse = {
          id: group.id,
          name: group.name,
          description: group.description,
          picture: group.picture,
          leaderName: leader.firstName + ' ' + leader.lastName,
        };
        return response;
      }),
    );
    return groups.filter(
      (group) => group !== undefined,
    ) as GetInvitesResponse[];
  }

  async acceptInvite(req: any, groupId: number) {
    let student = await this.studentService.findOneByEmail(req.user.email);

    let groupInvite = await this.groupInviteRepository.findOne({
      where: { userId: student.id, groupId: groupId },
    });

    if (groupInvite == null) {
      throw new HttpException('Invitation invalide', HttpStatus.BAD_REQUEST);
    }

    let group = await this.groupRepository.findOne({
      where: { id: groupInvite.groupId },
    });

    group.studentIds.push(student.id);
    student.groupId = group.id;

    await this.groupInviteRepository.delete({ userId: student.id });

    await this.groupRepository.save(group);
    await this.studentService.save(student);

    this.notificationService.createNotification(
      'Invitation acceptée',
      student.firstName +
        ' ' +
        student.lastName +
        ' a accepté de rejoindre votre groupe',
      NotificationType.GROUP,
      group.leaderId,
    );
  }

  async refuseInvite(req: any, groupId: number) {
    let student = await this.studentService.findOneByEmail(req.user.email);

    let groupInvite = await this.groupInviteRepository.findOne({
      where: { userId: student.id, groupId: groupId },
    });

    if (groupInvite == null) {
      throw new HttpException('Invitation invalide', HttpStatus.BAD_REQUEST);
    }

    let group = await this.groupRepository.findOne({
      where: { id: groupInvite.groupId },
    });

    await this.groupInviteRepository.delete(groupInvite);

    this.notificationService.createNotification(
      'Invitation refusée',
      student.firstName +
        ' ' +
        student.lastName +
        ' a refusé de rejoindre votre groupe',
      NotificationType.GROUP,
      group.leaderId,
    );
  }

  async leaveGroup(req: any) {
    let student = await this.studentService.findOneByEmail(req.user.email);

    if (student.groupId == null) {
      throw new HttpException(
        "Vous n'avez pas de groupe",
        HttpStatus.BAD_REQUEST,
      );
    }

    let group = await this.getUserGroup(req);

    if (student.id == group.leaderId) {
      throw new HttpException(
        'Vous ne pouvez pas quitter un group dont vous être le chef',
        HttpStatus.BAD_REQUEST,
      );
    }

    group.studentIds = group.studentIds.filter((it) => it != student.id);
    student.groupId = null;

    this.groupRepository.save(group);
    this.studentService.save(student);
  }

  async ejectMember(req: any, userId: any) {
    let student = await this.studentService.findOneByEmail(req.user.email);

    if (student.groupId == null) {
      throw new HttpException(
        "Vous n'avez pas de groupe",
        HttpStatus.BAD_REQUEST,
      );
    }

    if (student.id == userId) {
      throw new HttpException(
        'Vous ne pouvez pas vous éjecter vous même',
        HttpStatus.BAD_REQUEST,
      );
    }

    let group = await this.getUserGroup(req);

    if (student.id != group.leaderId) {
      throw new HttpException(
        'Vous devez être chef de groupe pour éjecter un membre',
        HttpStatus.FORBIDDEN,
      );
    }

    let member = await this.studentService.findOneById(userId);

    if (member == null || member.groupId != student.groupId) {
      throw new HttpException(
        "Cet étudiant n'a pas été trouvé",
        HttpStatus.NOT_FOUND,
      );
    }

    let missions = await this.missionRepository
      .createQueryBuilder('mission')
      .where('mission.groupId = :groupId', { groupId: group.id })
      .andWhere('mission.status IN (:...statuses)', {
        statuses: [
          MissionStatus.IN_PROGRESS,
          MissionStatus.ACCEPTED,
          MissionStatus.PROVISIONED,
        ],
      })
      .getMany();
    if (missions.length > 0) {
      throw new HttpException(
        'Vous ne pouvez pas éjecter un membre si une mission est en cours',
        HttpStatus.CONFLICT,
      );
    }

    group.studentIds = group.studentIds.filter((it) => it != member.id);
    member.groupId = null;

    this.groupRepository.save(group);
    this.studentService.save(member);

    return HttpStatus.OK;
  }

  async getAllGroups(
    req: any,
    searchOption: CompanySearchGroupsFilterDto,
  ): Promise<GetCompanySearchGroupsDto[]> {
    const { searchString } = searchOption;

    const company = await this.CompanyService.findOne(req.user.email);
    if (!company)
      throw new HttpException('Groupe invalide', HttpStatus.NOT_FOUND);

    let groupsQuery: SelectQueryBuilder<Group> =
      this.groupRepository.createQueryBuilder('group');

    groupsQuery = groupsQuery.andWhere(
      new Brackets((qb) => {
        if (searchString && searchString.trim().length > 0) {
          const searchParams = searchString
            .trim()
            .split(',')
            .map((elem) => elem.trim());

          searchParams.forEach((searchParam, index) => {
            const nameSearch = `nameSearch${index}`;
            const descriptionSearch = `descriptionSearch${index}`;

            qb.orWhere(`group.name LIKE :${nameSearch}`, {
              [nameSearch]: `%${searchParam}%`,
            });
            qb.orWhere(`group.description LIKE :${descriptionSearch}`, {
              [descriptionSearch]: `%${searchParam}%`,
            });
          });
        }
        if (searchOption.groupName) {
          qb.andWhere('group.name = :groupName', {
            groupName: searchOption.groupName,
          });
        }
        qb.andWhere('group.isActive = true', {
          isActive: true,
        });
      }),
    );

    const groups = await groupsQuery.getMany();

    const dtos = Promise.all(
      groups.map(async (it) => {
        let students = await this.studentService.findAllByIdIn(it.studentIds);
        let studentProfiles = await Promise.all(
          students.map(async (it) => {
            let studentProfile = await this.studentService.findStudentProfile(
              it.email,
            );
            return studentProfile;
          }),
        );
        let dto: GetCompanySearchGroupsDto = {
          id: it.id,
          name: it.name,
          description: it.description,
          studentsProfiles: studentProfiles,
        };
        return dto;
      }),
    );

    let filteredGroups = await dtos;

    if (searchOption.skills) {
      filteredGroups = filterGroupsBySkills(filteredGroups, searchOption.skills);
    }

    if (searchOption.size) {
      filteredGroups = filterGroupBySize(filteredGroups, searchOption.size);
    }

    return filteredGroups;
  }

  async checkIfStudentIsInGroup(student: any) {
    if (student.groupId) {
      return true;
    }
    const group = await this.groupRepository.findOne({
      where: { leaderId: student.id },
    });
    if (group) {
      return true;
    }

    const groups = await this.groupRepository.find();
    let groupMember = false;
    const studentIdAsString = student.id.toString();
    groups.forEach((group) => {
      if (group.studentIds.includes(studentIdAsString)) {
        groupMember = true;
      }
    });
    (groupMember);

    if (groupMember) {
      return true;
    }

    return false;
  }
}


function filterGroupsBySkills(dto: GetCompanySearchGroupsDto[], skillsString: string): GetCompanySearchGroupsDto[] {

  const skillsArray = skillsString.split(',').map(skill => skill.trim().toLowerCase());

  const filteredGroups = dto.filter(group => {
    return group.studentsProfiles.some(studentProfile => {
      const studentSkills = Object.values(studentProfile.skills).flat().map(skill => skill.toLowerCase());
      return skillsArray.some(skill => studentSkills.includes(skill));
    });
  });

  return filteredGroups;
}

function filterGroupBySize(dto: GetCompanySearchGroupsDto[], size: number): GetCompanySearchGroupsDto[] {
  return dto.filter(group => group.studentsProfiles.length >= size);
}
