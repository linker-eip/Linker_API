import { Module } from "@nestjs/common"
import { Gateway } from "./gateway";
import { StudentService } from "src/student/student.service";
import { StudentModule } from "src/student/student.module";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [
        StudentModule,
        JwtModule
    ],
    providers: [Gateway],
})
export class GatewayModule {}