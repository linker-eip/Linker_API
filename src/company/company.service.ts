import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyProfile } from './entity/CompanyProfile.entity';
import { CompanyUser } from './entity/CompanyUser.entity';
import { Repository } from 'typeorm';
import { CreateCompanyProfileDto } from './dto/create-company-profile.dto';
import { CompanyDocument } from './entity/CompanyDocument.entity';
import { UploadCompanyDocumentDto } from './dto/upload-company-document.dto';
import { DocumentStatus } from './enum/CompanyDocument.enum';
import { DocumentTransferService } from 'src/document-transfer/src/services/document-transfer.service';
import { DocumentStatusResponseDto } from './dto/document-status-response.dto';

@Injectable()
export class CompanyService {

  constructor(
    @InjectRepository(CompanyUser)
    private companyRepository: Repository<CompanyUser>,
    @InjectRepository(CompanyProfile)
    private companyProfileRepository: Repository<CompanyProfile>,
    @InjectRepository(CompanyDocument)
    private companyDocumentRepository: Repository<CompanyDocument>,
    private readonly documentTransferService: DocumentTransferService,

  ) { }

  async findAll(): Promise<CompanyUser[]> {
    return this.companyRepository.find();
  }

  async save(company: CompanyUser): Promise<CompanyUser> {
    return this.companyRepository.save(company);
  }

  async findOne(email: string): Promise<CompanyUser | undefined> {
    return this.companyRepository.findOne({ where: { email } });
  }

  async findOneByPhoneNumber(
    phoneNumber: string,
  ): Promise<CompanyUser | undefined> {
    return this.companyRepository.findOne({ where: { phoneNumber } });
  }

  async findOneByResetPasswordToken(
    token: string,
  ): Promise<CompanyUser | undefined> {
    return this.companyRepository.findOne({
      where: { resetPasswordToken: token },
    });
  }

  async CreateCompanyProfile(
    companyProfileDto: CreateCompanyProfileDto,
  ): Promise<CompanyProfile> {
    const CompanyProfileObj = new CompanyProfile();
    CompanyProfileObj.name = companyProfileDto.name;
    CompanyProfileObj.description = companyProfileDto.description;
    CompanyProfileObj.email = companyProfileDto.email;
    CompanyProfileObj.phone = companyProfileDto.phone;
    CompanyProfileObj.address = companyProfileDto.address;
    CompanyProfileObj.size = companyProfileDto.size;
    CompanyProfileObj.location = companyProfileDto.location;
    CompanyProfileObj.activity = companyProfileDto.activity;
    CompanyProfileObj.speciality = companyProfileDto.speciality;
    CompanyProfileObj.website = companyProfileDto.website;
    CompanyProfileObj.picture = companyProfileDto.picture;

    return this.companyProfileRepository.save(CompanyProfileObj);
  }

  async findCompanyById(companyId: number): Promise<CompanyUser> {
    return this.companyRepository.findOne({ where: { id: companyId } })
  }

  async findCompanyProfile(email: string): Promise<CompanyProfile> {
    return this.companyProfileRepository.findOne({ where: { email } });
  }

  async findCompanyProfileById(id: number): Promise<CompanyProfile> {
    return this.companyProfileRepository.findOne({ where: { companyId: id } });
  }

  async updateCompanyProfile(
    CreateCompanyProfileDto: CreateCompanyProfileDto,
    req: any,
  ): Promise<CompanyProfile> {
    const user = await this.companyRepository.findOne({
      where: { email: req.email },
    });
    if (!user) throw new Error(`Could not find company profile`);
    let companyProfile = await this.companyProfileRepository.findOne({
      where: { email: req.email },
    });
    if (!companyProfile) {
      companyProfile = new CompanyProfile();
    }

    companyProfile.companyId = user.id;

    if (CreateCompanyProfileDto.name)
      companyProfile.name = CreateCompanyProfileDto.name;

    if (CreateCompanyProfileDto.description)
      companyProfile.description = CreateCompanyProfileDto.description;

    companyProfile.email = user.email;

    if (CreateCompanyProfileDto.phone)
      companyProfile.phone = CreateCompanyProfileDto.phone;

    if (CreateCompanyProfileDto.address)
      companyProfile.address = CreateCompanyProfileDto.address;

    if (CreateCompanyProfileDto.size)
      companyProfile.size = CreateCompanyProfileDto.size;

    if (CreateCompanyProfileDto.location)
      companyProfile.location = CreateCompanyProfileDto.location;

    if (CreateCompanyProfileDto.activity)
      companyProfile.activity = CreateCompanyProfileDto.activity;

    if (CreateCompanyProfileDto.speciality)
      companyProfile.speciality = CreateCompanyProfileDto.speciality;

    if (CreateCompanyProfileDto.website)
      companyProfile.website = CreateCompanyProfileDto.website;

    if (CreateCompanyProfileDto.picture)
      companyProfile.picture = CreateCompanyProfileDto.picture;

    return this.companyProfileRepository.save(companyProfile);
  }

  async findCompanyProfileByCompanyId(companyId: number) {
    return this.companyProfileRepository.findOne({ where: { companyId } });
  }

  async deleteCompany(company: any) {
    const companyProfile = await this.companyProfileRepository.findOne({
      where: { companyId: company.id },
    });
    if (companyProfile) {
      await this.companyProfileRepository.remove(companyProfile);
    }
    return this.companyRepository.remove(company);
  }

  async uploadCompanyDocument(file: any, uploadCompanyDocument: UploadCompanyDocumentDto, user: any) {
    let company;
    company = await this.companyRepository.findOne({ where: { email: user.email } })
    if (!company) {
      throw new HttpException("Invalid company", HttpStatus.UNAUTHORIZED)
    }

    let companyDocument = await this.companyDocumentRepository.findOne({ where: { companyId: company.id, documentType: uploadCompanyDocument.documentType } })

    if (companyDocument != null) {
      if (companyDocument.status == DocumentStatus.VERIFIED) {
        throw new HttpException("Ce fichier a déjà été validé", HttpStatus.CONFLICT)
      }
    } else {
      companyDocument = new CompanyDocument()
    }

    const url = await this.documentTransferService.uploadFileNotImage(file);

    companyDocument.file = url
    companyDocument.companyId = company.id;
    companyDocument.comment = "";
    companyDocument.documentType = uploadCompanyDocument.documentType;
    companyDocument.status = DocumentStatus.PENDING;

    this.companyDocumentRepository.save(companyDocument);
  }

  async getDocumentStatus(user: any): Promise<DocumentStatusResponseDto[]> {
    const company = await this.companyRepository.findOne({ where: { email: user.email } });
    if (!company) {
      throw new HttpException("Invalid company", HttpStatus.UNAUTHORIZED)
    }

    const documentStatuses = await this.companyDocumentRepository.findBy({ companyId: company.id })

    const documentStatusesResponse = documentStatuses.map(doc => {
      const it = new DocumentStatusResponseDto()
      it.documentType = doc.documentType
      it.status = doc.status
      it.comment = doc.comment
      return it
    })

    return documentStatusesResponse
  }
}
