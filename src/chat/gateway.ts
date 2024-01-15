import { HttpCode, HttpException, HttpStatus, OnModuleInit, UseGuards } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { AuthGuard } from '@nestjs/passport'
import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets'
import { HttpStatusCode } from 'axios'
import { Server, Socket } from 'socket.io'
import { StudentUser } from 'src/student/entity/StudentUser.entity'
import { StudentService } from 'src/student/student.service'
import { StudiesDto } from 'src/student/studies/dto/studies.dto'

@WebSocketGateway()
export class Gateway implements OnModuleInit {
    constructor(
        private readonly studentService: StudentService,
        private readonly jwtService: JwtService
    ) {}

    private studentUsers: Map<string, StudentUser> = new Map();

    @WebSocketServer()
    server: Server

    onModuleInit() {
        this.server.on('connection', async (socket: Socket) => {
            let jwtPayload;
            try {
            const jwt = socket.request.headers['authorization'].split(' ')[1]
            jwtPayload = this.jwtService.verify(jwt, { secret: process.env.JWT_SECRET})
            } catch (error) {
                socket.emit('error', { message: 'Unauthorized access' });
                socket.disconnect()
            }
            if (jwtPayload.userType == "USER_STUDENT") {
                const student = await this.studentService.findOneByEmail(jwtPayload.email)
                console.log(student)
                if (student == null) {
                    socket.emit('error', { message: 'Unauthorized access' });
                    socket.disconnect()
                    return;
                }
                this.studentUsers[socket.id] = student;

                socket.join("GROUP_" + student.groupId)
            }
        })

    }

    @SubscribeMessage('sendGroup')
    onNewMessage(@MessageBody() body: any, @ConnectedSocket() socket: Socket) {
        const studentUser: StudentUser = this.studentUsers[socket.id]
        if (studentUser == null) {
            socket.emit('error', { message: 'Unauthorized access' });
        }
        let message = {
            content: body.message,
            firstName: studentUser.firstName,
            lastName: studentUser.lastName,
            picture: studentUser.picture,
        }
        this.server.to("GROUP_" + studentUser.groupId).emit("groupMessage", message)

    }
}