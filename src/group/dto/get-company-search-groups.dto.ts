import { ApiProperty } from "@nestjs/swagger";
import { Studies } from "../../student/studies/entity/studies.entity";
import { Skills } from "../../student/skills/entity/skills.entity";
import { Jobs } from "../../student/jobs/entity/jobs.entity";

export class StudentProfileResponseDto {
    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    phone: string;

    @ApiProperty()
    location: string;

    @ApiProperty()
    picture: string;

    @ApiProperty({type : Studies, isArray : true})
    studies: Studies[];

    @ApiProperty({type : Skills, isArray : true})
    skills: Skills[];

    @ApiProperty({type : Jobs, isArray : true})
    jobs: Jobs[];

    @ApiProperty()
    website: string;

    @ApiProperty()
    note: number;
}

export class GetCompanySearchGroupsDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    studentsProfiles: StudentProfileResponseDto[];
}