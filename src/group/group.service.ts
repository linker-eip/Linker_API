import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group-dto';
import { StudentService } from 'src/student/student.service';
import { Group } from './entity/Group.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateGroupDto } from './dto/update-group-dto';

@Injectable()
export class GroupService {
    constructor(
        @InjectRepository(Group)
        private readonly groupRepository: Repository<Group>,
        private readonly studentService: StudentService
        ) {}
        
    async findGroupById(groupId: number): Promise<Group> {
        const group = await this.groupRepository.findOne({
            where: {id: groupId}
        })
        return group
    }

    async createGroup(req: any, createGroupDto: CreateGroupDto) {
        let student;
        try {
            student = await this.studentService.findOne(req.user.email);
        } catch (err) {
            throw new HttpException('Invalid student', HttpStatus.UNAUTHORIZED)
        }
        
        if (student.group != null) {
            throw new HttpException('Student already has a group', HttpStatus.BAD_REQUEST)
        }

        const group = new Group();
        group.name = createGroupDto.name;
        group.description = createGroupDto.description;
        group.picture = createGroupDto.picture;
        group.leaderId = student.id;
        group.studentIds = [student.id]
        
        return await this.groupRepository.save(group);
    }

    async updateGroup(req: any, updateGroupDto: UpdateGroupDto) {
        let group;
        let student = await this.studentService.findOne(req.user.email)
        try {
            group = await this.groupRepository.findOne({where: {leaderId: student.id}})
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

}
