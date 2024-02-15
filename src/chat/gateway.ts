import { HttpCode, HttpException, HttpStatus, OnModuleInit, UseGuards } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { AuthGuard } from '@nestjs/passport'
import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets'
import { HttpStatusCode } from 'axios'
import { Server, Socket } from 'socket.io'
import { StudentUser } from 'src/student/entity/StudentUser.entity'
import { StudentService } from 'src/student/student.service'
import { StudiesDto } from 'src/student/studies/dto/studies.dto'
import { Message, MessageType, UserType } from './entity/Message.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CompanyUser } from 'src/company/entity/CompanyUser.entity'
import { Mission } from 'src/mission/entity/mission.entity'

@WebSocketGateway({cors: true})
export class Gateway implements OnModuleInit {
    constructor(
        @InjectRepository(Message)
        private messageRepository: Repository<Message>,
        @InjectRepository(CompanyUser)
        private companyRepository: Repository<CompanyUser>,
        @InjectRepository(Mission)
        private missionRepository: Repository<Mission>,
        private readonly studentService: StudentService,
        private readonly jwtService: JwtService
    ) { }

    private studentUsers: Map<string, StudentUser> = new Map();
    private companyUsers: Map<string, CompanyUser> = new Map();

    @WebSocketServer()
    server: Server

    onModuleInit() {
        this.server.on('connection', async (socket: Socket) => {
            let jwtPayload;
            console.log(socket.request.headers)
            try {
                const jwt = socket.request.headers['authorization'].split(' ')[1]
                jwtPayload = this.jwtService.verify(jwt, { secret: process.env.JWT_SECRET })
            } catch (error) {
                socket.emit('error', { message: 'Unauthorized access' });
                socket.disconnect()
            }
            if (jwtPayload != null && jwtPayload.userType != null) {
                if (jwtPayload.userType == "USER_STUDENT") {
                    const student = await this.studentService.findOneByEmail(jwtPayload.email)
                    if (student == null) {
                        socket.emit('error', { message: 'Unauthorized access' });
                        socket.disconnect()
                        return;
                    }
                    this.studentUsers[socket.id] = student;
                    console.log("Le socketId: " + socket.id + "est bien associé à l'étudiant: " + student.firstName + " " + student.lastName)

                    if (student.groupId != null) {
                        socket.join("GROUP_" + student.groupId)
                    }
                    const studentMissions = await this.missionRepository.findBy({ groupId: student.groupId })
                    studentMissions.forEach(mission => {
                        socket.join("MISSION_" + mission.id)
                    })

                } else if (jwtPayload.userType == "USER_COMPANY") {
                    const company = await this.companyRepository.findOneBy({ email: jwtPayload.email })
                    if (company == null) {
                        socket.emit('error', { message: 'Unauthorized access' })
                        socket.disconnect()
                        return;
                    }
                    this.companyUsers[socket.id] = company;

                    const companyMissions = await this.missionRepository.findBy({ companyId: company.id })
                    companyMissions.forEach(mission => {
                        socket.join("MISSION_" + mission.id)
                    })
                }
            }
        })

    }

    @SubscribeMessage('sendGroup')
    onNewGroupMessage(@MessageBody() body: any, @ConnectedSocket() socket: Socket) {
        console.log("Le socketId est: " + socket.id)
        const studentUser: StudentUser = this.studentUsers[socket.id]
        console.log("Et donc l'utilisateur est: " + studentUser ?? "null")
        if (studentUser == null) {
            socket.emit('error', { message: 'Unauthorized access' });
            return;
        }
        let message = {
            content: body.message,
            firstName: studentUser.firstName,
            lastName: studentUser.lastName,
            picture: studentUser.picture,
        }
        let storedMessage = new Message();
        storedMessage.author = studentUser.id,
            storedMessage.authorType = UserType.STUDENT_USER,
            storedMessage.type = MessageType.GROUP,
            storedMessage.content = message.content,
            storedMessage.channelId = studentUser.groupId,

            this.messageRepository.save(storedMessage)

        this.server.to("GROUP_" + studentUser.groupId).emit("groupMessage", message)

    }

    @SubscribeMessage('groupHistory')
    async onGroupHistory(@MessageBody() body: any, @ConnectedSocket() socket: Socket) {
        console.log("Le socketId est: " + socket.id)
        const studentUser: StudentUser = this.studentUsers[socket.id]
        console.log("Et donc l'utilisateur est: " + studentUser ?? "null")
        if (studentUser == null) {
            socket.emit('error', { message: 'Unauthorized access' });
            return
        }
        let history = await this.messageRepository.findBy({ type: MessageType.GROUP, channelId: studentUser.groupId })

        let historyDto = await Promise.all(history.map(async (message) => {
            let user = await this.studentService.findOneById(message.author);
            let profile = await this.studentService.findStudentProfile(user.email)
            return {
                id: message.id,
                firstName: user.firstName,
                lastName: user.lastName,
                picture: profile.picture,
                timestamp: message.timestamp,
                content: message.content
            };
        }));
        console.log(historyDto)
        socket.emit("groupHistory", historyDto)
    }

    @SubscribeMessage('sendMission')
    async onNewMissionpMessage(@MessageBody() body: any, @ConnectedSocket() socket: Socket) {
        const studentUser: StudentUser = this.studentUsers[socket.id]
        const companyUser: CompanyUser = this.companyUsers[socket.id]
        let message;
        let storedMessage = new Message();

        if (body.id == null) {
            socket.emit('error', { message: 'no mission id provided' })
            return;
        }

        if (studentUser != null) {
            let mission = await this.missionRepository.findOneBy({ id: body.id, groupId: studentUser.groupId })
            if (mission == null) {
                socket.emit('error', { message: 'mission not found' })
                return;
            }
            message = {
                content: body.message,
                firstName: studentUser.firstName,
                lastName: studentUser.lastName,
                picture: studentUser.picture,
                type: UserType.STUDENT_USER,
                missionId: mission.id
            }

            storedMessage.author = studentUser.id
            storedMessage.authorType = UserType.STUDENT_USER
            storedMessage.type = MessageType.MISSION
            storedMessage.content = message.content
            storedMessage.channelId = mission.id
        } else if (companyUser != null) {
            let mission = await this.missionRepository.findOneBy({ id: body.id, companyId: companyUser.id })
            if (mission == null) {
                socket.emit('error', { message: 'mission not found' })
                return;
            }
            message = {
                content: body.message,
                firstName: companyUser.companyName,
                lastName: null,
                picture: companyUser.picture,
                type: UserType.COMPANY_USER,
                missionId: mission.id
            }

            storedMessage.author = companyUser.id
            storedMessage.authorType = UserType.COMPANY_USER
            storedMessage.type = MessageType.MISSION
            storedMessage.content = message.content
            storedMessage.channelId = mission.id
        }

        this.messageRepository.save(storedMessage)

        this.server.to("MISSION_" + storedMessage.channelId).emit("missionMessage", message)
    }


    @SubscribeMessage('missionHistory')
    async onMissionHistory(@MessageBody() body: any, @ConnectedSocket() socket: Socket) {
        const studentUser: StudentUser = this.studentUsers[socket.id]
        const companyUser: CompanyUser = this.companyUsers[socket.id]
        if (body.id == null) {
            socket.emit('error', { message: 'no mission id provided' })
            return;
        }

        if (studentUser != null) {
            let mission = await this.missionRepository.findOneBy({ id: body.id, groupId: studentUser.groupId })
            if (mission == null) {
                socket.emit('error', { message: 'mission not found' })
                return;
            }

            let history = await this.messageRepository.findBy({ type: MessageType.MISSION, channelId: mission.id })
            let historyDto = await Promise.all(history.map(async (message) => {
                let user;
                if (message.authorType == UserType.STUDENT_USER) {
                    user = await this.studentService.findOneById(message.author);
                    return {
                        id: message.id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        picture: user.picture,
                        timestamp: message.timestamp,
                        content: message.content,
                        type: UserType.STUDENT_USER
                    };
                } else {
                    user = await this.companyRepository.findOneBy({id: message.author});
                    return {
                        id: message.id,
                        firstName: user.companyName,
                        lastName: null,
                        picture: user.picture,
                        timestamp: message.timestamp,
                        content: message.content,
                        type: UserType.COMPANY_USER
                    };
                }

            }));
            socket.emit("missionHistory", historyDto)
        } else if (companyUser != null) {
            let mission = await this.missionRepository.findOneBy({ id: body.id, companyId: companyUser.id })
            if (mission == null) {
                socket.emit('error', { message: 'mission not found' })
                return;
            }

            let history = await this.messageRepository.findBy({ type: MessageType.MISSION, channelId: mission.id })
            let historyDto = await Promise.all(history.map(async (message) => {
                let user;
                if (message.authorType == UserType.STUDENT_USER) {
                    user = await this.studentService.findOneById(message.author);
                    return {
                        id: message.id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        picture: user.picture,
                        timestamp: message.timestamp,
                        content: message.content,
                        type: UserType.STUDENT_USER,
                    };
                } else {
                    user = await this.companyRepository.findOneBy({id: message.author});
                    return {
                        id: message.id,
                        firstName: user.companyName,
                        lastName: null,
                        picture: user.picture,
                        timestamp: message.timestamp,
                        content: message.content,
                        type: UserType.COMPANY_USER
                    };
                }

            }));
            socket.emit("missionHistory", historyDto)
        }
    }
}


