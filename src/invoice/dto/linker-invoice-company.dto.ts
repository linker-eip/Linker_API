import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';

interface Row {
  [key: string]: string | number;
}

export class LinkerInvoiceCompanyDto {
  @ApiProperty()
  @IsNumber()
  missionId: number;

  @ApiProperty()
  @IsNumber()
  companyId: number;

  @ApiProperty()
  @IsString()
  companyEmail: string;

  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty({ isArray: true })
  @IsArray()
  headerFields: string[];

  @ApiProperty({ isArray: true })
  @IsArray()
  rows: Row[];
}
