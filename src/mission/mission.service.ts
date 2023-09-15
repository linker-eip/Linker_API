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

    async createMission(createMissionDto: CreateMissionDto, req: any) {
        let company = null;
        console.log(req)
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
}
