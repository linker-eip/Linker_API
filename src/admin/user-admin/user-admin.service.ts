import { Injectable } from '@nestjs/common';
import { StudentSearchOptionAdminDto } from './dto/student-search-option-admin.dto';
import { StudentUser } from '../../student/entity/StudentUser.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, ILike, Brackets } from 'typeorm';

@Injectable()
export class UserAdminService {
  constructor(
    @InjectRepository(StudentUser)
    private readonly studentUserRepository: Repository<StudentUser>,
  ) {}

  async findAllStudents(
    searchOption: StudentSearchOptionAdminDto,
  ): Promise<StudentUser[]> {
    const { searchString } = searchOption;

    let studentsQuery = this.studentUserRepository
      .createQueryBuilder('studentUser')
      .where(new Brackets((qb) => {
        if (searchString && searchString.trim().length > 0) {
          const searchParams = searchString
            .trim()
            .split(',')
            .map((elem) => elem.trim());

          searchParams.forEach((searchParam, index) => {
            const emailSearch = `emailSearch${index}`;
            const firstNameSearch = `firstNameSearch${index}`;
            const lastNameSearch = `lastNameSearch${index}`;

            qb.orWhere(`studentUser.email LIKE :${emailSearch}`, {
              [emailSearch]: `%${searchParam}%`,
            });
            qb.orWhere(`studentUser.firstName LIKE :${firstNameSearch}`, {
              [firstNameSearch]: `%${searchParam}%`,
            });
            qb.orWhere(`studentUser.lastName LIKE :${lastNameSearch}`, {
              [lastNameSearch]: `%${searchParam}%`,
            });
          });
        }
        if (searchOption.isActive) {
          qb.andWhere('studentUser.isActive = :isActive', {
            isActive: searchOption.isActive,
          });
        }
      }));

    const students = await studentsQuery.getMany();
    return students;
  }
}
