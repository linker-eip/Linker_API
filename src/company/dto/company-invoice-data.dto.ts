import { ApiProperty } from '@nestjs/swagger';

interface Row {
  [key: string]: string | number;
}

export class CompanyInvoiceDataDto {
  @ApiProperty()
  companyName: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  location: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  missionName: string;

  @ApiProperty()
  invoiceNumber: number;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  headerFields: string[];

  @ApiProperty()
  rows: Row[];

  @ApiProperty()
  studentName: string;

  @ApiProperty()
  studentLocation: string;
}
