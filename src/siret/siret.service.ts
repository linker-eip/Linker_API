import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class SiretService {
    constructor(

    ) { }

    async searchCompanyFromSiret(siret: String) {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `https://api.insee.fr/entreprises/sirene/V3/siret/${siret}?champs=siren,siret,dateCreationEtablissement,denominationUniteLegale,nomUniteLegale,activitePrincipaleEtablissement`,
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + process.env.SIRET_BEARER
            }
        };

        try {
            const response = await axios.request(config)
            return response.data.etablissement
        } catch (e) {
            throw new HttpException("SIRET invalide", HttpStatus.BAD_REQUEST)
        }
    }
}
