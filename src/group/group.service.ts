import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpStatusCode } from 'axios';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { CompanyService } from '../company/company.service';
import { Mission } from '../mission/entity/mission.entity';
import { MissionStatus } from '../mission/enum/mission-status.enum';
import { NotificationType } from '../notifications/entity/Notification.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { StudentDocument } from '../student/entity/StudentDocuments.entity';
import { StudentUser } from '../student/entity/StudentUser.entity';
import { DocumentStatus } from '../student/enum/StudentDocument.enum';
import { StudentService } from '../student/student.service';
import { CompanySearchGroupsFilterDto } from './dto/company-search-groups-filter.dto';
import { CreateGroupDto } from './dto/create-group-dto';
import { GetCompanySearchGroupsDto } from './dto/get-company-search-groups.dto';
import { GetGroupeResponse } from './dto/get-group-response-dto';
import { GetInvitesResponse, GetPersonnalInvitesResponse } from './dto/get-invites-response-dto';
import { UpdateGroupDto } from './dto/update-group-dto';
import { Group } from './entity/Group.entity';
import { GroupInvite } from './entity/GroupInvite.entity';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(GroupInvite)
    private readonly groupInviteRepository: Repository<GroupInvite>,
    @InjectRepository(Mission)
    private readonly missionRepository: Repository<Mission>,
    @InjectRepository(StudentDocument)
    private readonly studentDocumentRepository: Repository<StudentDocument>,
    private readonly studentService: StudentService,
    private readonly notificationService: NotificationsService,
    private readonly CompanyService: CompanyService,
  ) {
  }

  async groupVerification(student: StudentUser) {
    const studentDocuments = await this.studentDocumentRepository.findBy({
      studentId: student.id,
      status: DocumentStatus.VERIFIED,
    });
    if (studentDocuments.length < 4)
      throw new HttpException(
        'Vous ne pouvez pas avoir de groupe avant d\'avoir fait vérifier tous vos documents',
        HttpStatusCode.Forbidden,
      );
  }

  async getUserGroup(req: any): Promise<Group> {
    let group;
    const student = await this.studentService.findOneByEmail(req.user.email);
    try {
      group = await this.groupRepository.findOne({
        where: { id: student.groupId },
      });
    } catch (err) {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }

    if (group == null) {
      throw new HttpException(
        'Vous n\'avez pas de groupe',
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

    await this.groupVerification(student);

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
      'Group created',
      'Le groupe ' + group.name + ' a bien été créé',
      'The group ' + group.name + ' has been created',
      NotificationType.GROUP,
      student.id,
    );

    return group;
  }

  async updateGroup(req: any, updateGroupDto: UpdateGroupDto) {
    let group;
    const student = await this.studentService.findOneByEmail(req.user.email);
    try {
      group = await this.groupRepository.findOne({
        where: { leaderId: student.id },
      });
    } catch (err) {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }

    if (group == null)
      throw new HttpException(
        'Vous n\'êtes pas le chef d\'un groupe',
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
    const student = await this.studentService.findOneByEmail(req.user.email);
    try {
      group = await this.groupRepository.findOne({
        where: { leaderId: student.id },
      });
    } catch (err) {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }

    if (group == null)
      throw new HttpException(
        'Vous n\'êtes pas le chef d\'un groupe',
        HttpStatus.BAD_REQUEST,
      );

    group.studentIds.forEach(async (id) => {
      const student = await this.studentService.findOneById(id);
      student.groupId = null;
      this.studentService.save(student);
    });

    this.groupRepository.delete(group.id);
  }

  async getGroup(req: any): Promise<GetGroupeResponse> {
    let group;
    const student = await this.studentService.findOneByEmail(req.user.email);
    if (student.groupId == null) {
      throw new HttpException(
        'Vous n\'avez pas de groupe',
        HttpStatus.NO_CONTENT,
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
        'Vous n\'avez pas de groupe',
        HttpStatus.NO_CONTENT,
      );
    }

    const groupMember = await this.studentService.findAllByIdIn(
      group.studentIds,
    );
    const groupMemberDtos = await Promise.all(
      groupMember.map(async (it) => {
        const studentProfile = await this.studentService.findStudentProfile(
          it.email,
        );
        const dto = {
          firstName: it.firstName,
          lastName: it.lastName,
          id: it.id,
          isLeader: group.leaderId == it.id,
          picture: studentProfile.picture,
        };
        return dto;
      }),
    );

    const response: GetGroupeResponse = {
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
    const group = await this.getUserGroup(req);
    const student = await this.studentService.findOneByEmail(req.user.email);

    if (group.leaderId != student.id) {
      throw new HttpException('Vous n\'êtes pas le chef d\'un groupe', 400);
    }

    const invitedStudent = await this.studentService.findOneById(userId);
    if (invitedStudent == null) {
      throw new HttpException(
        'Cet étudiant n\'existe pas',
        HttpStatus.NOT_FOUND,
      );
    }

    if (invitedStudent.isActive == false) {
      throw new HttpException(
        'Cet étudiant n\'est pas actif',
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

    const groupInvite = new GroupInvite();

    groupInvite.groupId = group.id;
    groupInvite.userId = invitedStudent.id;

    this.groupInviteRepository.save(groupInvite);
    this.notificationService.createNotification(
      'Invitation',
      'Invitation',
      'Vous avez été invité à rejoindre le groupe ' + group.name,
      'You have been invited to join the group ' + group.name,
      NotificationType.GROUP,
      invitedStudent.id,
    );
  }

  async cancelInvite(req: any, userId: number) {
    const group = await this.getUserGroup(req);
    const student = await this.studentService.findOneByEmail(req.user.email);

    if (group.leaderId != student.id) {
      throw new HttpException('Vous n\'êtes pas le chef d\'un groupe', 400);
    }

    const groupInvite = await this.groupInviteRepository.findOne({
      where: { userId: userId, groupId: group.id },
    });
    if (groupInvite) {
      this.groupInviteRepository.delete(groupInvite);
    }
  }

  async getGroupInvites(req: any): Promise<GetPersonnalInvitesResponse[]> {
    const group = await this.getUserGroup(req);
    const student = await this.studentService.findOneByEmail(req.user.email);

    if (group.leaderId != student.id) {
      throw new HttpException('Vous n\'êtes pas le chef d\'un groupe', 400);
    }

    const groupInvites = await this.groupInviteRepository.findBy({
      groupId: group.id,
    });

    return Promise.all(
      groupInvites.map(async (it) => {
        const user = await this.studentService.findOneById(it.userId);
        const userProfile = await this.studentService.findStudentProfile(
          user.email,
        );
        const groupInviteResponse: GetPersonnalInvitesResponse = {
          id: user.id,
          name: user.firstName + ' ' + user.lastName,
          picture: userProfile.picture,
        };
        return groupInviteResponse;
      }),
    );
  }

  async getInvites(req: any): Promise<GetInvitesResponse[]> {
    const student = await this.studentService.findOneByEmail(req.user.email);
    const groupInvites = await this.groupInviteRepository.findBy({
      userId: student.id,
    });
    const groups = await Promise.all(
      groupInvites.map(async (it) => {
        const group = await this.groupRepository.findOne({
          where: { id: it.groupId },
        });
        if (group == null) {
          return;
        }
        const leader = await this.studentService.findOneById(group.leaderId);
        const response: GetInvitesResponse = {
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
    const student = await this.studentService.findOneByEmail(req.user.email);

    await this.groupVerification(student);

    const groupInvite = await this.groupInviteRepository.findOne({
      where: { userId: student.id, groupId: groupId },
    });

    if (groupInvite == null) {
      throw new HttpException('Invitation invalide', HttpStatus.BAD_REQUEST);
    }

    const group = await this.groupRepository.findOne({
      where: { id: groupInvite.groupId },
    });

    group.studentIds.push(student.id);
    student.groupId = group.id;

    await this.groupInviteRepository.delete({ userId: student.id });

    await this.groupRepository.save(group);
    await this.studentService.save(student);

    this.notificationService.createNotification(
      'Invitation acceptée',
      'Invitation accepted',
      student.firstName +
      ' ' +
      student.lastName +
      ' a accepté de rejoindre votre groupe',
      student.firstName + ' ' + student.lastName + ' has accepted to join your group',
      NotificationType.GROUP,
      group.leaderId,
    );
  }

  async refuseInvite(req: any, groupId: number) {
    const student = await this.studentService.findOneByEmail(req.user.email);

    const groupInvite = await this.groupInviteRepository.findOne({
      where: { userId: student.id, groupId: groupId },
    });

    if (groupInvite == null) {
      throw new HttpException('Invitation invalide', HttpStatus.BAD_REQUEST);
    }

    const group = await this.groupRepository.findOne({
      where: { id: groupInvite.groupId },
    });

    await this.groupInviteRepository.delete(groupInvite);

    this.notificationService.createNotification(
      'Invitation refusée',
      'Invitation refused',
      student.firstName +
      ' ' +
      student.lastName +
      ' a refusé de rejoindre votre groupe',
      student.firstName + ' ' + student.lastName + ' has refused to join your group',
      NotificationType.GROUP,
      group.leaderId,
    );
  }

  async leaveGroup(req: any) {
    const student = await this.studentService.findOneByEmail(req.user.email);

    if (student.groupId == null) {
      throw new HttpException(
        'Vous n\'avez pas de groupe',
        HttpStatus.BAD_REQUEST,
      );
    }

    const group = await this.getUserGroup(req);

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
    const student = await this.studentService.findOneByEmail(req.user.email);

    if (student.groupId == null) {
      throw new HttpException(
        'Vous n\'avez pas de groupe',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (student.id == userId) {
      throw new HttpException(
        'Vous ne pouvez pas vous éjecter vous même',
        HttpStatus.BAD_REQUEST,
      );
    }

    const group = await this.getUserGroup(req);

    if (student.id != group.leaderId) {
      throw new HttpException(
        'Vous devez être chef de groupe pour éjecter un membre',
        HttpStatus.FORBIDDEN,
      );
    }

    const member = await this.studentService.findOneById(userId);

    if (member == null || member.groupId != student.groupId) {
      throw new HttpException(
        'Cet étudiant n\'a pas été trouvé',
        HttpStatus.NOT_FOUND,
      );
    }

    const missions = await this.missionRepository
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

    const company = await this.CompanyService.findOne(req.user.email);
    if (!company)
      throw new HttpException('Groupe invalide', HttpStatus.NOT_FOUND);

    const mission = await this.missionRepository.findOne({
      where: { id: searchOption.missionId },
    });

    if (!mission)
      throw new HttpException('Mission non trouvée', HttpStatus.NOT_FOUND);

    if (mission) {
      if (mission.companyId != company.id) {
        // throw new HttpException(
        //   'Vous n\'avez pas accès à cette mission',
        //   HttpStatus.NOT_FOUND,
        // );
      }
    }

    let groupsQuery: SelectQueryBuilder<Group> =
      this.groupRepository.createQueryBuilder('group');

    groupsQuery = groupsQuery.andWhere(
      new Brackets((qb) => {

        qb.andWhere('group.isActive = true', {
          isActive: true,
        });
      }),
    );

    const groups = await groupsQuery.getMany();

    const dtos = Promise.all(
      groups.map(async (it) => {
        const students = await this.studentService.findAllByIdIn(it.studentIds);
        const studentProfiles = await Promise.all(
          students.map(async (it) => {
            const studentProfile = await this.studentService.findStudentProfile(
              it.email,
            );
            return studentProfile;
          }),
        );
        const dto: GetCompanySearchGroupsDto = {
          id: it.id,
          score: 0,
          name: it.name,
          description: it.description,
          studentsProfiles: studentProfiles,
        };
        return dto;
      }),
    );

    let filteredGroups = await dtos;

    filteredGroups = groupMatchingAlgorithm(filteredGroups, mission.skills);

    filteredGroups.sort((a, b) => b.score - a.score);

    if (searchOption.groupName) {
      filteredGroups = filteredGroups.filter((group) =>
      group.name.includes(searchOption.groupName),
      );
      filteredGroups = filteredGroups.map((group) => {
        return { ...group, score: group.score + 5 };
      });
    }

    if (searchOption.location) {
      filteredGroups = filteredGroups.filter((group) =>
        group.studentsProfiles.some((studentProfile) =>
          studentProfile.location.includes(searchOption.location),
        ),
      );
      filteredGroups = filteredGroups.map((group) => {
        return { ...group, score: group.score + 5 };
      });
    }

    if (searchOption.size) {
      filteredGroups = filteredGroups.filter(
        (group) => group.studentsProfiles.length == searchOption.size,
      );
      filteredGroups = filteredGroups.map((group) => {
        return { ...group, score: group.score + 5 };
      });
    }


    return filteredGroups.slice(0, 10);

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
    groupMember;

    return groupMember;
  }

  async transferLeadership(req, userId: number) {
    const student = await this.studentService.findOneByEmail(req.user.email);
    const newLeader = await this.studentService.findOneById(userId);

    if (!student) {
      throw new HttpException('Etudiant non trouvé', HttpStatus.NOT_FOUND);
    }

    if (!newLeader) {
      throw new HttpException('Etudiant non trouvé', HttpStatus.NOT_FOUND);
    }

    if (student.groupId == null) {
      throw new HttpException(
        'Vous n\'avez pas de groupe',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (student.id == userId) {
      throw new HttpException(
        'Vous ne pouvez pas vous transférer le leadership',
        HttpStatus.BAD_REQUEST,
      );
    }

    const group = await this.getUserGroup(req);

    if (student.id != group.leaderId) {
      throw new HttpException(
        'Vous devez être chef de groupe pour transférer le leadership',
        HttpStatus.FORBIDDEN,
      );
    }

    const missions = await this.missionRepository
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
        'Vous ne pouvez pas transférer le leadership si une mission est en cours',
        HttpStatus.CONFLICT,
      );
    }
    if (group.id == newLeader.groupId) {
      group.leaderId = newLeader.id;
      await this.groupRepository.save(group);
    } else {
      throw new HttpException(
        'Cet étudiant n\'est pas dans votre groupe',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}

function filterGroupsBySkills(
  dto: GetCompanySearchGroupsDto[],
  skillsString: string,
): GetCompanySearchGroupsDto[] {
  const skillsArray = skillsString
    .split(',')
    .map((skill) => skill.trim().toLowerCase());

  const filteredGroups = dto.filter((group) => {
    return group.studentsProfiles.some((studentProfile) => {
      console.log('studentProfile', studentProfile);
      console.log('object', Object.values(studentProfile.skills));
      const studentSkills = Object.values(studentProfile.skills)
        .flat()
        .map((skill) => skill.toLowerCase());
      return skillsArray.some((skill) => studentSkills.includes(skill));
    });
  });

  return filteredGroups;
}


function assignJobsScore(groups: GetCompanySearchGroupsDto[]): GetCompanySearchGroupsDto[] {
  return groups.map(group => {
    const jobs = group.studentsProfiles.map(studentProfile => studentProfile.jobs.length);
    const score = group.score + jobs.reduce((acc, job) => acc + job, 0) / jobs.length;
    return { ...group, score };
  });}


function groupMatchingAlgorithm(groups: GetCompanySearchGroupsDto[], missionSkills: string): GetCompanySearchGroupsDto[] {
  const groupsWithSkillsScore = assignSkillsScore(groups, missionSkills);
  const groupsWithNotesScore = assignNotesScore(groupsWithSkillsScore);
  const groupsWithJobsScore = assignJobsScore(groupsWithNotesScore);
  return groupsWithJobsScore;
}

function assignSkillsScore(groups: GetCompanySearchGroupsDto[], missionSkills: string): GetCompanySearchGroupsDto[] {

  if (!missionSkills) {
    return groups;
  }

  return groups.map(group => {
    const groupSkills = group.studentsProfiles.map(studentProfile => {
      return Object.values(studentProfile.skills).flat();
    }).flat().map(skill => skill.toLowerCase());

    const missionSkillsArray = missionSkills.split(',').map(skill => skill.trim().toLowerCase());
    let score = 0;
    groupSkills.forEach(skill => {
      if (missionSkillsArray.includes(skill)) {
        score += 5;
      }
    });

    return { ...group, score };
  });
}

function assignNotesScore(groups: GetCompanySearchGroupsDto[]): GetCompanySearchGroupsDto[] {

  return groups.map(group => {
    const notes = group.studentsProfiles.map(studentProfile => studentProfile.note);
    const score = group.score + notes.reduce((acc, note) => acc + note, 0) / notes.length;
    return { ...group, score };
  }
);

}