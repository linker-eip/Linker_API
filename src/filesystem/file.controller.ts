import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import 'multer'

@Controller('api/file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 2 * 1024 * 1024, // 2MB
      },
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<string> {
    const fileName = await this.fileService.storeFile(file);
    return `File ${fileName} uploaded successfully`;
  }

  @Get('file')
  async getFile(@Param('fileName') fileName: string, @Res() res): Promise<any> {
    return this.fileService.getFile(fileName, res);
  }
}
