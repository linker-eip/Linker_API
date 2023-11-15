import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group-dto';
import { StudentService } from 'src/student/student.service';
import { Group } from './entity/Group.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class GroupService {
    constructor(
        @InjectRepository(Group)
        private readonly groupRepository: Repository<Group>,
        private readonly studentService: StudentService
    ) {}

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
}
