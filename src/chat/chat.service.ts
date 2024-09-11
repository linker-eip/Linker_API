import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entity/Message.entity';
import { Repository } from 'typeorm';
import { StudentService } from '../student/student.service';
import {
  ChannelInfoDto,
  StudentConversationResponseDto,
} from './dto/student-conversation-response.dto';
import { GroupService } from '../group/group.service';
import { MissionService } from '../mission/mission.service';
import { MissionStatus } from '../mission/enum/mission-status.enum';
import {
  CompanyChannelInfoDto,
  CompanyConversationResponseDto,
} from './dto/company-conversation-response.dto';
import { CompanyService } from '../company/company.service';
import { SendFileInChatDto } from './dto/chat-send-file.dto';
import { DocumentTransferService } from '../document-transfer/src/services/document-transfer.service';
import { Gateway } from './gateway';
import { MessageType } from './enum/MessageType.enum';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private readonly studentService: StudentService,
    private readonly companyService: CompanyService,
    private readonly groupService: GroupService,
    private readonly missionService: MissionService,
    private readonly documentService: DocumentTransferService,
    private readonly gateway: Gateway,
  ) {
  }

  async getStudentConversations(
    req: any,
  ): Promise<StudentConversationResponseDto> {
    const student = await this.studentService.findOneByEmail(req.user.email);
    if (!student) {
      throw new HttpException('Etudiant invalide', 404);
    }

    // Group channels
    const groupChannel: ChannelInfoDto = new ChannelInfoDto();
    if (student.groupId) {
      this.groupService.findGroupById(student.groupId).then((group) => {
        groupChannel.id = group.id;
        groupChannel.name = group.name;
        groupChannel.logo = group.picture;
      });
    }

    // Mission channels
    const studentMissions = await this.missionService.findAllByGroupId(
      student.groupId,
    );
    const missionChannels: ChannelInfoDto[] = await Promise.all(
      studentMissions
        .filter((mission) => mission.status != MissionStatus.PENDING)
        .map(async (mission) => {
          const companyPicture = (
            await this.companyService.findCompanyById(mission.companyId)
          ).picture;
          return {
            id: mission.id,
            name: mission.name,
            logo: companyPicture,
          };
        }),
    );

    // Premission channels

    const premissionMessagesIds = new Set(
      (
        await this.messageRepository.findBy({
          type: MessageType.PREMISSION,
        })
      ).map((message) => message.channelId),
    );

    const filteredMessagesIds = Array.from(premissionMessagesIds).filter(
      (id) => {
        return id.split('/')[1] === student.groupId.toString();
      },
    );

    const premissionChannels: ChannelInfoDto[] = await Promise.all(
      filteredMessagesIds.map(async (id) => {
        const mission = await this.missionService.findMissionById(
          parseInt(id.split('/')[0]),
        );
        const companyPicture = (
          await this.companyService.findCompanyById(mission.companyId)
        ).picture;
        return {
          id: mission.id,
          name: mission.name,
          logo: companyPicture,
        };
      }),
    );

    // DM channels
    const pattern = `${student.id}/\\d+|\\d+/${student.id}`;
    const regexep = new RegExp(pattern, 'g');

    const dmChannelsIds = new Set(
      (
        await this.messageRepository
          .createQueryBuilder('message')
          .where('message.type = :type', { type: MessageType.DM })
          .andWhere('message.channelId ~ :pattern', { pattern: regexep.source })
          .getMany()
      ).map((message) => {
        return message.channelId
          .split('/')
          .find((id) => id !== student.id.toString());
      }),
    );
    dmChannelsIds.delete(undefined);
    let dmChannels: ChannelInfoDto[] = [];
    dmChannels = await Promise.all(
      Array.from(dmChannelsIds).map(async (id) => {
        const student = await this.studentService.findOneById(parseInt(id));
        return {
          id: student.id,
          name: student.firstName + ' ' + student.lastName,
          logo: await this.studentService.findStudentPicture(student.id),
        };
      }),
    );

    return {
      groupChannel,
      missionChannels,
      premissionChannels,
      dmChannels,
    };
  }

  async getCompanyConversations(
    req: any,
  ): Promise<CompanyConversationResponseDto> {
    const company = await this.companyService.findOne(req.user.email);
    if (!company) {
      throw new HttpException('Entreprise invalide', 404);
    }

    // Mission channels
    const companyMissions = await this.missionService.findAllByCompanyId(
      company.id,
    );
    const missionChannels: CompanyChannelInfoDto[] = await Promise.all(
      companyMissions
        .filter((mission) => mission.status != MissionStatus.PENDING)
        .map(async (mission) => {
          const groupPicture = await this.groupService
            .findGroupById(mission.groupId)
            .then((group) => group.picture);
          return {
            id: mission.id,
            groupId: mission.groupId,
            name: mission.name,
            logo: groupPicture,
          };
        }),
    );

    // Premission channels

    const premissionList = companyMissions.filter((mission) => {
      return mission.status === MissionStatus.PENDING;
    });

    const premissionMessagesIds = new Set(
      (
        await this.messageRepository.findBy({
          type: MessageType.PREMISSION,
        })
      ).map((message) => message.channelId),
    );

    const premissionChannels: CompanyChannelInfoDto[] = [];

    premissionList.forEach((mission) => {
      const filteredMessages = Array.from(premissionMessagesIds).filter(
        (id) => {
          return id.split('/')[0] === mission.id.toString();
        },
      );

      filteredMessages.forEach((id) => {
        premissionChannels.push({
          id: mission.id,
          groupId: parseInt(id.split('/')[1]),
          name: mission.name,
          logo: '',
        });
      });
    });

    return {
      missionChannels,
      premissionChannels,
    };
  }

  getMessageTypeKeyByValue(value: MessageType): string {
    return MessageType[value].toString();
  }

  async sendFileInChat(
    req: any,
    file: any,
    body: SendFileInChatDto,
  ): Promise<any> {
    if (req.user.userType == 'USER_COMPANY') {
      return this.companySendFileInChat(req, file, body);
    }
    const student = await this.studentService.findOneByEmail(req.user.email);
    if (!student) {
      throw new HttpException('Etudiant invalide', 404);
    }

    let fileUrl;
    try {
      fileUrl = await this.documentService.uploadFile(file);
    } catch (error) {
      throw new HttpException('Impossible de télécharger le fichier', 400);
    }

    switch (body.type.toString()) {
      case this.getMessageTypeKeyByValue(MessageType.MISSION): {
        await this.gateway.onNewMissionMessage(
          {
            student: student,
            id: body.channelId,
            message: fileUrl,
            isFile: true,
          },
          null,
        );
        break;
      }
      case this.getMessageTypeKeyByValue(MessageType.GROUP): {
        await this.gateway.onNewGroupMessage(
          {
            student: student,
            message: fileUrl,
            isFile: true,
          },
          null,
        );
        break;
      }
      case this.getMessageTypeKeyByValue(MessageType.PREMISSION): {
        await this.gateway.onNewPreMissionMessage(
          {
            student: student,
            missionId: body.channelId,
            message: fileUrl,
            isFile: true,
          },
          null,
        );
        break;
      }
      case this.getMessageTypeKeyByValue(MessageType.DM): {
        await this.gateway.onNewDirectMessage(
          {
            student: student,
            userId: body.channelId,
            message: fileUrl,
            isFile: true,
          },
          null,
        );
        break;
      }
    }
  }

  private async companySendFileInChat(
    req: any,
    file: any,
    body: SendFileInChatDto,
  ) {
    const company = await this.companyService.findOne(req.user.email);
    if (!company) {
      throw new HttpException('Etudiant invalide', 404);
    }

    let fileUrl;
    try {
      fileUrl = await this.documentService.uploadFile(file);
    } catch (error) {
      throw new HttpException('Impossible de télécharger le fichier', 400);
    }

    switch (body.type.toString()) {
      case this.getMessageTypeKeyByValue(MessageType.MISSION): {
        await this.gateway.onNewMissionMessage(
          {
            student: company,
            id: body.channelId,
            message: fileUrl,
            isFile: true,
          },
          null,
        );
        break;
      }
      case this.getMessageTypeKeyByValue(MessageType.GROUP): {
        await this.gateway.onNewGroupMessage(
          {
            student: company,
            message: fileUrl,
            isFile: true,
          },
          null,
        );
        break;
      }
      case this.getMessageTypeKeyByValue(MessageType.PREMISSION): {
        await this.gateway.onNewPreMissionMessage(
          {
            student: company,
            missionId: body.channelId,
            groupId: body.groupId,
            message: fileUrl,
            isFile: true,
          },
          null,
        );
        break;
      }
    }
  }
}
