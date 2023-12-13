import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group-dto';
import { StudentService } from 'src/student/student.service';
import { Group } from './entity/Group.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateGroupDto } from './dto/update-group-dto';
import { GetGroupeResponse } from './dto/get-group-response-dto';
import { NotificationsService } from 'src/notifications/notifications.service';
import { NotificationType } from 'src/notifications/entity/Notification.entity';

@Injectable()
export class GroupService {
    constructor(
        @InjectRepository(Group)
        private readonly groupRepository: Repository<Group>,
        private readonly studentService: StudentService,
        private readonly notificationService: NotificationsService
    ) { }

    async findGroupById(groupId: number): Promise<Group> {
        const group = await this.groupRepository.findOne({
            where: { id: groupId }
        })
        return group
    }

    async findGroupByName(name: string): Promise<Group> {
        const group = await this.groupRepository.findOne({
            where: { name: name }
        })
        return group
    }

    async createGroup(req: any, createGroupDto: CreateGroupDto) {
        let student;
        try {
            student = await this.studentService.findOneByEmail(req.user.email);
        } catch (err) {
            throw new HttpException('Invalid student', HttpStatus.UNAUTHORIZED)
        }

        if (student.groupId != null) {
            throw new HttpException('Student already has a group', HttpStatus.BAD_REQUEST)
        }

        if (await this.findGroupByName(createGroupDto.name) != null) {
            throw new HttpException('Il existe déjà un groupe portant ce nom', HttpStatus.BAD_REQUEST)
        }

        const group = new Group();
        group.name = createGroupDto.name;
        group.description = createGroupDto.description;
        group.picture = createGroupDto.picture;
        group.leaderId = student.id;
        group.studentIds = [student.id]

        await this.groupRepository.save(group);
        student.groupId = group.id
        this.studentService.save(student);

        this.notificationService.createNotification("Groupe créé", "Le groupe " + group.name + " a bien été créé", NotificationType.GROUP, student.id)

        return (group)
    }

    async updateGroup(req: any, updateGroupDto: UpdateGroupDto) {
        let group;
        let student = await this.studentService.findOneByEmail(req.user.email)
        try {
            group = await this.groupRepository.findOne({ where: { leaderId: student.id } })
        } catch (err) {
            throw new HttpException("Bad request", HttpStatus.BAD_REQUEST);
        }


        if (group == null)
            throw new HttpException("Vous n'êtes pas le chef d'un groupe", HttpStatus.BAD_REQUEST)

        if (updateGroupDto.name != null) {
            group.name = updateGroupDto.name;
        }
        if (updateGroupDto.description != null) {
            group.description = updateGroupDto.description
        }
        if (updateGroupDto.picture != null) {
            group.picture = updateGroupDto.picture
        }
        await this.groupRepository.save(group);
        return await this.findGroupById(group.id)
    }

    async deleteGroup(req: any) {
        let group;
        let student = await this.studentService.findOneByEmail(req.user.email)
        try {
            group = await this.groupRepository.findOne({ where: { leaderId: student.id } })
        } catch (err) {
            throw new HttpException("Bad request", HttpStatus.BAD_REQUEST);
        }

        if (group == null)
            throw new HttpException("Vous n'êtes pas le chef d'un groupe", HttpStatus.BAD_REQUEST)

        group.studentIds.forEach(async id => {
            let student = await this.studentService.findOneById(id)
            student.groupId = null;
            this.studentService.save(student)
        });

        this.groupRepository.delete(group.id);
    }

    async getGroup(req: any): Promise<GetGroupeResponse> {
        let group;
        let student = await this.studentService.findOneByEmail(req.user.email)
        if (student.groupId == null) {
            throw new HttpException("Vous n'avez pas de groupe", HttpStatus.NOT_FOUND);
        }
        try {
            group = await this.groupRepository.findOne({ where: { id: student.groupId } })
        } catch (err) {
            throw new HttpException("Bad request", HttpStatus.BAD_REQUEST);
        }

        if (group == null) {
            throw new HttpException("Vous n'avez pas de groupe", HttpStatus.NOT_FOUND);
        }

        let response: GetGroupeResponse = {
            name: group.name,
            description: group.description,
            picture: group.picture,
            membersIds: group.studentIds,
            leaderId: group.leaderId,
            isLeader: group.leaderId == student.id
        }
        return response;
    }
}
