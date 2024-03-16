import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyProfile } from './entity/CompanyProfile.entity';
import { CompanyUser } from './entity/CompanyUser.entity';
import { Repository } from 'typeorm';
import { CreateCompanyProfileDto } from './dto/create-company-profile.dto';
import { CompanyCreateInvoiceDto } from './dto/company-create-invoice.dto';
import { CompanyInvoiceDataDto } from './dto/company-invoice-data.dto';
import { MissionService } from '../mission/mission.service';
import { StudentService } from '../student/student.service';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(CompanyUser)
    private companyRepository: Repository<CompanyUser>,
    @InjectRepository(CompanyProfile)
    private companyProfileRepository: Repository<CompanyProfile>,
  ) {}

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
    return this.companyRepository.findOne({where: {id: companyId}})
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
}
