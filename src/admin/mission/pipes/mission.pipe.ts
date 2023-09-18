import { Injectable, NotFoundException, PipeTransform } from "@nestjs/common";
import { MissionService } from "../mission.service";

@Injectable()
export class MissionByIdPipe implements PipeTransform {
    constructor(private readonly missionService: MissionService) {}

    async transform(missionId: string) {
        if (isNaN(parseInt(missionId)))
            throw new NotFoundException('MISSION_NOT_FOUND');
        const mission = await this.missionService.findMissionById(
            parseInt(missionId),
        );
        if (mission) return mission.id;
        else throw new NotFoundException('MISSION_NOT_FOUND');
    }
}