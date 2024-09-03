/* import { ApiProperty } from "@nestjs/swagger";

export class missionAdminResponseDto{
    @ApiProperty()
    id: number;
    
    @ApiProperty()
    name: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    startOfMission: Date;

    @ApiProperty()
    endOfMission: Date;

    @ApiProperty()
    amount: number;

    @ApiProperty()
    numberOfStudents: number;
}*/

import { ApiProperty } from '@nestjs/swagger';
import { DocumentTypeEnum } from '../../../documents/enum/document-type.enum';
import { DocumentUserEnum } from '../../../documents/enum/document-user.enum';

export class DocumentAdminReponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  documentPath: string;

  @ApiProperty({ enum: DocumentTypeEnum })
  documentType: DocumentTypeEnum;

  @ApiProperty({ enum: DocumentUserEnum })
  documentUser: DocumentUserEnum;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  createdAt: Date;
}
