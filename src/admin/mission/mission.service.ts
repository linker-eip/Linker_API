import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Mission } from '../../mission/entity/mission.entity';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { CreateMissionDto } from './dto/create-mission.dto';
import { UserAdminService } from '../user-admin/user-admin.service';
import { MissionSearchOptionAdmin } from './dto/missions-search-option-admin.dto';

@Injectable()
export class MissionService {
  constructor(
    @InjectRepository(Mission)
    private readonly missionRepository: Repository<Mission>,
    private readonly userAdminService: UserAdminService,
  ) {}

  async createMission(createMissionDto: CreateMissionDto) {
    const mission = new Mission();
    mission.name = createMissionDto.name;
    mission.description = createMissionDto.description;
    mission.startOfMission = createMissionDto.startOfMission;
    mission.endOfMission = createMissionDto.endOfMission;
    mission.amount = createMissionDto.amount;
    mission.company = await this.userAdminService.findOneCompanyById(
      createMissionDto.companyId,
    );
    mission.companyId = createMissionDto.companyId;
    mission.studentsIds = createMissionDto.studentsIds;

    return await this.missionRepository.save(mission);
  }

  async findAllMissions(option: MissionSearchOptionAdmin): Promise<Mission[]> {
    const { searchString } = option;

    let missionsQuery: SelectQueryBuilder<Mission> =
      this.missionRepository.createQueryBuilder('mission');

    missionsQuery = missionsQuery.andWhere(
      new Brackets((qb) => {
        if (searchString && searchString.trim().length > 0) {
          const searchParams = searchString
            .trim()
            .split(',')
            .map((elem) => elem.trim());

          searchParams.forEach((searchParam, index) => {
            const nameSearch = `nameSearch${index}`;

            qb.orWhere(`mission.name LIKE :${nameSearch}`, {
              [nameSearch]: `%${searchParam}%`,
            });
          });
        }

        if (option.name) {
          qb.andWhere('mission.name = :name', {
            name: option.name,
          });
        }

        if (option.companyId) {
          qb.andWhere('mission.companyId = :companyId', {
            companyId: option.companyId,
          });
        }

        if (option.studentId) {
          qb.andWhere('mission.studentId = :studentId', {
            studentId: option.studentId,
          });
        }
      }),
    );

    const missions = await missionsQuery.getMany();
    return missions;
  }

  async deleteMission(missionId: number) {
    return await this.missionRepository.delete(missionId);
  }
}
