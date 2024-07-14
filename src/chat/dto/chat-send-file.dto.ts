import { ApiProperty } from "@nestjs/swagger";
import { MessageType } from '../entity/Message.entity';
import { IsEnum, IsOptional } from 'class-validator';

export class SendFileInChatDto {

  @ApiProperty({description:"Fichier au format PDF"})
  file: Express.Multer.File;

  @ApiProperty({description: "Id du salon (mission id ou user id)"})
  @IsOptional()
  channelId: number;

  @ApiProperty( {description: "Id secondaire du salon (group id dans le cas d'une premission pour une company)"})
  @IsOptional()
  groupId?: number;

  @ApiProperty({description: "Type de message"})
  @IsEnum(MessageType)
  type: MessageType;
}