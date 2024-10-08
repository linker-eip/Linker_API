import { OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { StudentUser } from '../student/entity/StudentUser.entity';
import { StudentService } from '../student/student.service';
import { Message, UserType } from './entity/Message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyUser } from '../company/entity/CompanyUser.entity';
import { Mission } from '../mission/entity/mission.entity';
import { MissionStatus } from '../mission/enum/mission-status.enum';
import { CompanyService } from '../company/company.service';
import { MessageType } from './enum/MessageType.enum';

@WebSocketGateway({ cors: true })
export class Gateway implements OnModuleInit {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(CompanyUser)
    private companyRepository: Repository<CompanyUser>,
    @InjectRepository(Mission)
    private missionRepository: Repository<Mission>,
    private readonly studentService: StudentService,
    private readonly companyService: CompanyService,
    private readonly jwtService: JwtService,
  ) {
  }

  private studentUsers: Map<string, StudentUser> = new Map();
  private companyUsers: Map<string, CompanyUser> = new Map();

  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', async (socket: Socket) => {
      let jwtPayload;
      try {
        const jwt = socket.request.headers['authorization'].split(' ')[1];
        jwtPayload = this.jwtService.verify(jwt, {
          secret: process.env.JWT_SECRET,
        });
      } catch (error) {
        socket.emit('error', { message: 'Unauthorized access' });
        socket.disconnect();
      }
      if (jwtPayload != null && jwtPayload.userType != null) {
        if (jwtPayload.userType == 'USER_STUDENT') {
          const student = await this.studentService.findOneByEmail(
            jwtPayload.email,
          );
          if (student == null) {
            socket.emit('error', { message: 'Unauthorized access' });
            socket.disconnect();
            return;
          }
          this.studentUsers[socket.id] = student;

          if (student.groupId != null) {
            socket.join('GROUP_' + student.groupId);
          }
          const studentMissions = await this.missionRepository.findBy({
            groupId: student.groupId,
          });
          studentMissions.forEach((mission) => {
            socket.join('MISSION_' + mission.id);
          });
        } else if (jwtPayload.userType == 'USER_COMPANY') {
          const company = await this.companyRepository.findOneBy({
            email: jwtPayload.email,
          });
          if (company == null) {
            socket.emit('error', { message: 'Unauthorized access' });
            socket.disconnect();
            return;
          }
          this.companyUsers[socket.id] = company;

          const companyMissions = await this.missionRepository.findBy({
            companyId: company.id,
          });
          companyMissions.forEach((mission) => {
            socket.join('MISSION_' + mission.id);
          });
        }
      }
    });
  }

  @SubscribeMessage('sendGroup')
  async onNewGroupMessage(
    @MessageBody() body: any,
    @ConnectedSocket() socket: Socket,
  ) {
    let studentUser: StudentUser;
    if (body && body.student) {
      studentUser = body.student;
    } else {
      studentUser = this.studentUsers[socket.id];
    }
    const profile = await this.studentService.findStudentProfile(
      studentUser.email,
    );
    if (studentUser == null) {
      socket.emit('error', { message: 'Unauthorized access' });
      return;
    }
    if (body.message == null) {
      socket.emit('error', { message: 'no message provided' });
      return;
    }
    const message = {
      content: body.message,
      firstName: studentUser.firstName,
      lastName: studentUser.lastName,
      picture: profile.picture,
      isFile: body.isFile,
    };
    const storedMessage = new Message();
    (storedMessage.author = studentUser.id),
      (storedMessage.authorType = UserType.STUDENT_USER),
      (storedMessage.type = MessageType.GROUP),
      (storedMessage.content = message.content),
      (storedMessage.channelId = studentUser.groupId.toString()),
      (storedMessage.isFile = body.isFile),
      this.messageRepository.save(storedMessage);

    this.server
      .to('GROUP_' + studentUser.groupId)
      .emit('groupMessage', message);
  }

  @SubscribeMessage('groupHistory')
  async onGroupHistory(
    @MessageBody() body: any,
    @ConnectedSocket() socket: Socket,
  ) {
    let studentUser: StudentUser;
    if (body && body.student) {
      studentUser = body.student;
    } else {
      studentUser = this.studentUsers[socket.id];
    }
    if (studentUser == null) {
      socket.emit('error', { message: 'Unauthorized access' });
      return;
    }
    const history = await this.messageRepository.findBy({
      type: MessageType.GROUP,
      channelId: studentUser.groupId.toString(),
    });

    const historyDto = await Promise.all(
      history.map(async (message) => {
        const user = await this.studentService.findOneById(message.author);
        const profile = await this.studentService.findStudentProfile(
          user.email,
        );
        return {
          id: message.id,
          firstName: user.firstName,
          lastName: user.lastName,
          picture: profile.picture,
          timestamp: message.timestamp,
          content: message.content,
          isFile: message.isFile,
        };
      }),
    );
    socket.emit('groupHistory', historyDto);
  }

  @SubscribeMessage('sendMission')
  async onNewMissionMessage(
    @MessageBody() body: any,
    @ConnectedSocket() socket: Socket,
  ) {
    let studentUser: StudentUser;
    if (body && body.student) {
      studentUser = body.student;
    } else {
      studentUser = this.studentUsers[socket.id];
    }
    let companyUser: CompanyUser;
    if (body && body.company) {
      companyUser = body.company;
    } else {
      companyUser = this.companyUsers[socket.id];
    }
    let message;
    const storedMessage = new Message();

    if (body.id == null) {
      socket.emit('error', { message: 'no mission id provided' });
      return;
    }
    if (body.message == null) {
      socket.emit('error', { message: 'no message provided' });
      return;
    }

    if (studentUser != null) {
      const profile = await this.studentService.findStudentProfile(
        studentUser.email,
      );
      const mission = await this.missionRepository.findOneBy({
        id: body.id,
        groupId: studentUser.groupId,
      });
      if (mission == null) {
        socket.emit('error', { message: 'mission not found' });
        return;
      }
      message = {
        content: body.message,
        firstName: studentUser.firstName,
        lastName: studentUser.lastName,
        picture: profile.picture,
        type: UserType.STUDENT_USER,
        missionId: mission.id,
        isFile: body.isFile,
      };

      storedMessage.author = studentUser.id;
      storedMessage.authorType = UserType.STUDENT_USER;
      storedMessage.type = MessageType.MISSION;
      storedMessage.content = message.content;
      storedMessage.channelId = mission.id.toString();
      storedMessage.isFile = body.isFile;
    } else if (companyUser != null) {
      const mission = await this.missionRepository.findOneBy({
        id: body.id,
        companyId: companyUser.id,
      });
      const profile = await this.companyService.findCompanyProfile(
        companyUser.email,
      );
      if (mission == null) {
        socket.emit('error', { message: 'mission not found' });
        return;
      }
      message = {
        content: body.message,
        firstName: companyUser.companyName,
        lastName: null,
        picture: profile.picture,
        type: UserType.COMPANY_USER,
        missionId: mission.id,
        isFile: body.isFile,
      };

      storedMessage.author = companyUser.id;
      storedMessage.authorType = UserType.COMPANY_USER;
      storedMessage.type = MessageType.MISSION;
      storedMessage.content = message.content;
      storedMessage.channelId = mission.id.toString();
      storedMessage.isFile = body.isFile;
    }

    this.messageRepository.save(storedMessage);

    this.server
      .to('MISSION_' + storedMessage.channelId)
      .emit('missionMessage', message);
  }

  @SubscribeMessage('missionHistory')
  async onMissionHistory(
    @MessageBody() body: any,
    @ConnectedSocket() socket: Socket,
  ) {
    let studentUser: StudentUser;
    if (body && body.student) {
      studentUser = body.student;
    } else {
      studentUser = this.studentUsers[socket.id];
    }
    let companyUser: CompanyUser;
    if (body && body.company) {
      companyUser = body.company;
    } else {
      companyUser = this.companyUsers[socket.id];
    }

    if (body.id == null) {
      socket.emit('error', { message: 'no mission id provided' });
      return;
    }

    if (studentUser != null) {
      const mission = await this.missionRepository.findOneBy({
        id: body.id,
        groupId: studentUser.groupId,
      });
      if (mission == null) {
        socket.emit('error', { message: 'mission not found' });
        return;
      }

      const history = await this.messageRepository.findBy({
        type: MessageType.MISSION,
        channelId: mission.id.toString(),
      });
      const historyDto = await Promise.all(
        history.map(async (message) => {
          let user;
          if (message.authorType == UserType.STUDENT_USER) {
            user = await this.studentService.findOneById(message.author);
            const profile = await this.studentService.findStudentProfile(
              user.email,
            );
            return {
              id: message.id,
              firstName: user.firstName,
              lastName: user.lastName,
              picture: profile.picture,
              timestamp: message.timestamp,
              content: message.content,
              type: UserType.STUDENT_USER,
              isFile: message.isFile,
            };
          } else {
            user = await this.companyRepository.findOneBy({
              id: message.author,
            });
            const profile = await this.companyService.findCompanyProfile(
              user.email,
            );
            return {
              id: message.id,
              firstName: user.companyName,
              lastName: null,
              picture: profile.picture,
              timestamp: message.timestamp,
              content: message.content,
              type: UserType.COMPANY_USER,
              isFile: message.isFile,
            };
          }
        }),
      );
      socket.emit('missionHistory', historyDto);
    } else if (companyUser != null) {
      const mission = await this.missionRepository.findOneBy({
        id: body.id,
        companyId: companyUser.id,
      });
      if (mission == null) {
        socket.emit('error', { message: 'mission not found' });
        return;
      }

      const history = await this.messageRepository.findBy({
        type: MessageType.MISSION,
        channelId: mission.id.toString(),
      });
      const historyDto = await Promise.all(
        history.map(async (message) => {
          let user;
          if (message.authorType == UserType.STUDENT_USER) {
            user = await this.studentService.findOneById(message.author);
            const profile = await this.studentService.findStudentProfile(
              user.email,
            );
            return {
              id: message.id,
              firstName: user.firstName,
              lastName: user.lastName,
              picture: profile.picture,
              timestamp: message.timestamp,
              content: message.content,
              type: UserType.STUDENT_USER,
              isFile: message.isFile,
            };
          } else {
            user = await this.companyRepository.findOneBy({
              id: message.author,
            });
            const profile = await this.companyService.findCompanyProfile(
              user.email,
            );

            return {
              id: message.id,
              firstName: user.companyName,
              lastName: null,
              picture: profile.picture,
              timestamp: message.timestamp,
              content: message.content,
              type: UserType.COMPANY_USER,
              isFile: message.isFile,
            };
          }
        }),
      );
      socket.emit('missionHistory', historyDto);
    }
  }

  @SubscribeMessage('sendPremission')
  async onNewPreMissionMessage(
    @MessageBody() body: any,
    @ConnectedSocket() socket: Socket,
  ) {
    let studentUser: StudentUser;
    if (body && body.student) {
      studentUser = body.student;
    } else {
      studentUser = this.studentUsers[socket.id];
    }
    let companyUser: CompanyUser;
    if (body && body.company) {
      companyUser = body.company;
    } else {
      companyUser = this.companyUsers[socket.id];
    }
    let message;
    const storedMessage = new Message();

    if (body.missionId == null) {
      socket.emit('error', { message: 'no mission id provided' });
      return;
    }

    if (body.message == null) {
      socket.emit('error', { message: 'no message provided' });
      return;
    }

    if (studentUser != null) {
      if (studentUser.groupId == null) {
        socket.emit('error', { message: 'you are not in a group' });
        return;
      }
      const mission = await this.missionRepository.findOneBy({
        id: body.missionId,
        status: MissionStatus.PENDING,
      });
      const profile = await this.studentService.findStudentProfile(
        studentUser.email,
      );

      if (mission == null) {
        socket.emit('error', { message: 'mission not found' });
        return;
      }
      message = {
        content: body.message,
        firstName: studentUser.firstName,
        lastName: studentUser.lastName,
        picture: profile.picture,
        type: UserType.STUDENT_USER,
        missionId: mission.id,
        groupId: studentUser.groupId,
        isFile: body.isFile,
      };

      storedMessage.author = studentUser.id;
      storedMessage.authorType = UserType.STUDENT_USER;
      storedMessage.type = MessageType.PREMISSION;
      storedMessage.content = message.content;
      storedMessage.isFile = body.isFile;
      storedMessage.channelId =
        mission.id.toString() + '/' + studentUser.groupId.toString();
    } else if (companyUser != null) {
      if (body.groupId == null) {
        socket.emit('error', { message: 'no group id provided' });
        return;
      }

      const mission = await this.missionRepository.findOneBy({
        id: body.missionId,
        companyId: companyUser.id,
      });
      const profile = await this.companyService.findCompanyProfile(
        companyUser.email,
      );

      if (mission == null) {
        socket.emit('error', { message: 'mission not found' });
        return;
      }
      message = {
        content: body.message,
        firstName: companyUser.companyName,
        lastName: null,
        picture: profile.picture,
        type: UserType.COMPANY_USER,
        missionId: mission.id,
        groupId: body.groupId,
        isFile: body.isFile,
      };

      storedMessage.author = companyUser.id;
      storedMessage.authorType = UserType.COMPANY_USER;
      storedMessage.type = MessageType.PREMISSION;
      storedMessage.content = message.content;
      storedMessage.isFile = body.isFile;
      storedMessage.channelId =
        mission.id.toString() + '/' + body.groupId.toString();
    }

    this.messageRepository.save(storedMessage);

    this.server
      .to('MISSION_' + storedMessage.channelId)
      .emit('premissionMessage', message);
  }

  @SubscribeMessage('premissionHistory')
  async onPremissionHistory(
    @MessageBody() body: any,
    @ConnectedSocket() socket: Socket,
  ) {
    let studentUser: StudentUser;
    if (body && body.student) {
      studentUser = body.student;
    } else {
      studentUser = this.studentUsers[socket.id];
    }
    let companyUser: CompanyUser;
    if (body && body.company) {
      companyUser = body.company;
    } else {
      companyUser = this.companyUsers[socket.id];
    }
    if (body.missionId == null) {
      socket.emit('error', { message: 'no mission id provided' });
      return;
    }

    if (studentUser != null) {
      if (studentUser.groupId == null) {
        socket.emit('error', { message: 'you are not in a group' });
        return;
      }
      const mission = await this.missionRepository.findOneBy({
        id: body.missionId,
        status: MissionStatus.PENDING,
      });
      if (mission == null) {
        socket.emit('error', { message: 'mission not found' });
        return;
      }

      const history = await this.messageRepository.findBy({
        type: MessageType.PREMISSION,
        channelId: mission.id.toString() + '/' + studentUser.groupId.toString(),
      });
      const historyDto = await Promise.all(
        history.map(async (message) => {
          let user;
          if (message.authorType == UserType.STUDENT_USER) {
            user = await this.studentService.findOneById(message.author);
            const profile = await this.studentService.findStudentProfile(
              user.email,
            );

            return {
              id: message.id,
              firstName: user.firstName,
              lastName: user.lastName,
              picture: profile.picture,
              timestamp: message.timestamp,
              content: message.content,
              type: UserType.STUDENT_USER,
              isFile: message.isFile,
            };
          } else {
            user = await this.companyRepository.findOneBy({
              id: message.author,
            });
            const profile = await this.companyService.findCompanyProfile(
              user.email,
            );

            return {
              id: message.id,
              firstName: user.companyName,
              lastName: null,
              picture: profile.picture,
              timestamp: message.timestamp,
              content: message.content,
              type: UserType.COMPANY_USER,
              isFile: message.isFile,
            };
          }
        }),
      );
      socket.emit('premissionHistory', historyDto);
    } else if (companyUser != null) {
      if (body.groupId == null) {
        socket.emit('error', { message: 'no group id provided' });
        return;
      }
      const mission = await this.missionRepository.findOneBy({
        id: body.missionId,
        status: MissionStatus.PENDING,
      });
      if (mission == null) {
        socket.emit('error', { message: 'mission not found' });
        return;
      }

      const history = await this.messageRepository.findBy({
        type: MessageType.PREMISSION,
        channelId: mission.id.toString() + '/' + body.groupId.toString(),
      });
      const historyDto = await Promise.all(
        history.map(async (message) => {
          let user;
          if (message.authorType == UserType.STUDENT_USER) {
            user = await this.studentService.findOneById(message.author);
            const profile = await this.studentService.findStudentProfile(
              user.email,
            );

            return {
              id: message.id,
              firstName: user.firstName,
              lastName: user.lastName,
              picture: profile.picture,
              timestamp: message.timestamp,
              content: message.content,
              type: UserType.STUDENT_USER,
              isFile: message.isFile,
            };
          } else {
            user = await this.companyRepository.findOneBy({
              id: message.author,
            });
            const profile = await this.companyService.findCompanyProfile(
              user.email,
            );

            return {
              id: message.id,
              firstName: user.companyName,
              lastName: null,
              picture: profile.picture,
              timestamp: message.timestamp,
              content: message.content,
              type: UserType.COMPANY_USER,
              isFile: message.isFile,
            };
          }
        }),
      );
      socket.emit('premissionHistory', historyDto);
    }
  }

  @SubscribeMessage('sendDirectMessage')
  async onNewDirectMessage(
    @MessageBody() body: any,
    @ConnectedSocket() socket: Socket,
  ) {
    let studentUser: StudentUser;
    if (body && body.student) {
      studentUser = body.student;
    } else {
      studentUser = this.studentUsers[socket.id];
    }
    const profile = await this.studentService.findStudentProfile(
      studentUser.email,
    );
    if (studentUser == null) {
      socket.emit('error', { message: 'Unauthorized access' });
      return;
    }

    if (body.message == null) {
      socket.emit('error', { message: 'no message provided' });
      return;
    }

    if (body.userId == null) {
      socket.emit('error', { message: 'no userId provided' });
      return;
    }

    const recipient = await this.studentService.findOneById(body.userId);
    if (recipient == null) {
      socket.emit('error', { message: 'recipient user not found' });
      return;
    }

    const recipientSocket = Array.from(
      this.server.sockets.sockets.values(),
    ).find((socket) => {
      let studentUser: StudentUser;
      if (body && body.student) {
        studentUser = body.student;
      } else {
        studentUser = this.studentUsers[socket.id];
      }
      return studentUser && studentUser.id === body.userId;
    });

    const message = {
      content: body.message,
      firstName: studentUser.firstName,
      lastName: studentUser.lastName,
      picture: profile.picture,
      authorId: studentUser.id,
      recipientId: recipient.id,
      isFile: body.isFile,
    };
    const storedMessage = new Message();
    (storedMessage.author = studentUser.id),
      (storedMessage.authorType = UserType.STUDENT_USER),
      (storedMessage.type = MessageType.DM),
      (storedMessage.content = message.content),
      (storedMessage.isFile = body.isFile),
      (storedMessage.channelId =
        studentUser.id.toString() + '/' + recipient.id.toString()),
      this.messageRepository.save(storedMessage);

    this.server.to(socket.id).emit('directMessage', message);

    if (recipientSocket) {
      this.server.to(recipientSocket.id).emit('directMessage', message);
    }
  }

  @SubscribeMessage('directMessageHistory')
  async onDirectMessageHistory(
    @MessageBody() body: any,
    @ConnectedSocket() socket: Socket,
  ) {
    let studentUser: StudentUser;
    if (body && body.student) {
      studentUser = body.student;
    } else {
      studentUser = this.studentUsers[socket.id];
    }
    if (studentUser == null) {
      socket.emit('error', { message: 'Unauthorized access' });
      return;
    }

    if (!body.userId) {
      socket.emit('error', { message: 'no userId provided' });
      return;
    }

    const pattern = `^(${studentUser.id}/${body.userId}|${body.userId}/${studentUser.id})$`;
    const regexep = new RegExp(pattern, 'g');

    const history = await this.messageRepository
      .createQueryBuilder('message')
      .where('message.type = :type', { type: MessageType.DM })
      .andWhere('message.channelId ~ :pattern', { pattern: regexep.source })
      .getMany();

    const historyDto = await Promise.all(
      history.map(async (message) => {
        const user = await this.studentService.findOneById(message.author);
        const profile = await this.studentService.findStudentProfile(
          user.email,
        );
        return {
          id: message.id,
          authorId: message.author,
          firstName: user.firstName,
          lastName: user.lastName,
          picture: profile.picture,
          timestamp: message.timestamp,
          content: message.content,
          isFile: message.isFile,
        };
      }),
    );
    socket.emit('directMessageHistory', historyDto);
  }
}
