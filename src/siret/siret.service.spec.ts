import { Test, TestingModule } from "@nestjs/testing";
import { SiretController } from "./siret.controller";
import { SiretService } from "./siret.service";
import { AuthGuard, PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";

describe('SiretService', () => {
  let service: SiretService;
  let controller: SiretController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '60m' },
        }),
      ],
      controllers: [SiretController],
      providers: [SiretService],
    })
    .overrideGuard(AuthGuard('jwt'))
    .useValue({ canActivate: jest.fn(() => true) })
    .compile();

    controller = module.get<SiretController>(SiretController);
    service = module.get<SiretService>(SiretService);
  });

  describe('getSiret', () => {
    it('should return companies informations', async () => {
    
      const siret = "97788133300016"

      const expectedInfos =
            {
              "siren": "977881333",
              "siret": "97788133300016",
              "dateCreationEtablissement": "2023-08-01",
              "uniteLegale": {
                "denominationUniteLegale": null,
                "nomUniteLegale": "TARALLO"
              },
              "periodesEtablissement": [
                {
                  "dateFin": null,
                  "dateDebut": "2023-08-01",
                  "activitePrincipaleEtablissement": "62.01Z"
                }
              ]
            };


      jest.spyOn(service, 'searchCompanyFromSiret').mockResolvedValueOnce(expectedInfos);

      const response = await controller.getCompanyFromSiret(siret);

      expect(service.searchCompanyFromSiret).toHaveBeenCalledWith(siret);
      expect(response).toEqual(expectedInfos);
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});


