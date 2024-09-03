import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber } from 'class-validator';

interface Row {
  [key: string]: string | number;
}

export class CompanyCreateInvoiceDto {
  @ApiProperty()
  @IsNumber()
  missionId: number;

  @ApiProperty()
  @IsNumber()
  studentId: number;

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
