import { Controller, Get, Param } from '@nestjs/common';
import { SiretService } from './siret.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('siret')
@ApiTags('SIRET')
export class SiretController {
    constructor(private readonly siretService: SiretService) {}

    @Get('/siret/:siret')
    @ApiOperation({
        description: "Trouve une entreprise depuis son SIRET",
        summary: "Trouve une entreprise depuis son SIRET"
    })
    async getCompanyFromSiret(@Param('siret') siret: String)
    {
        return await this.siretService.searchCompanyFromSiret(siret);
    }
}
