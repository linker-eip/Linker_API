import { Module } from "@nestjs/common"
import { Gateway } from "./gateway";
import { StudentService } from "src/student/student.service";
import { StudentModule } from "src/student/student.module";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Message } from "./entity/Message.entity";
import { CompanyUser } from "src/company/entity/CompanyUser.entity";
import { Mission } from "src/mission/entity/mission.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Message, CompanyUser, Mission]),
        StudentModule,
        JwtModule
    ],
    providers: [Gateway],
})
export class GatewayModule {}