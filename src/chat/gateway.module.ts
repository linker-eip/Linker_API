import { Module } from "@nestjs/common"
import { Gateway } from "./gateway";
import { StudentService } from "src/student/student.service";
import { StudentModule } from "src/student/student.module";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Message } from "./entity/Message.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Message]),
        StudentModule,
        JwtModule
    ],
    providers: [Gateway],
})
export class GatewayModule {}