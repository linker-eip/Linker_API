import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Mission } from './entity/mission.entity';
import { Repository } from 'typeorm';
import { CreateMissionDto } from './dto/create-mission-dto';
import { CompanyService } from 'src/company/company.service';

@Injectable()
export class MissionService {

    constructor(
        @InjectRepository(Mission)
        private readonly missionRepository: Repository<Mission>,
        private readonly companyService: CompanyService
    ) {}

    async findMissionById(missionId: number) : Promise<Mission> {
        const mission = await this.missionRepository.findOne({
          where: { id: missionId },
        });

        return mission;
      }

    async createMission(createMissionDto: CreateMissionDto, req: any) {
        let company = null;
        try {
            company = await this.companyService.findOne(req.user.email)
        } catch (err) {
            throw new HttpException('Invalid company', HttpStatus.UNAUTHORIZED) 
        }

        const mission = new Mission();
        mission.name = createMissionDto.name
        mission.description = createMissionDto.description;
        mission.startOfMission = createMissionDto.startOfMission;
        mission.endOfMission = createMissionDto.endOfMission;
        mission.amount = createMissionDto.amount;
        mission.company = company
        mission.companyId = company.id;

        return await this.missionRepository.save(mission);
    }

    async deleteMission(missionId: number, req: any) {
        let company = null;
        try {
            company = await this.companyService.findOne(req.user.email)
        } catch (err) {
            throw new HttpException('Invalid company', HttpStatus.UNAUTHORIZED) 
        }

        const mission = await this.findMissionById(missionId)

        if (mission == null || mission.companyId != company.id) {
            throw new HttpException('Invalid mission', HttpStatus.NOT_FOUND)
        }

        return this.missionRepository.delete(mission.id)
    }
}
