import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';


@Controller('api/file')
export class FileController {
  constructor(private readonly fileService: FileService) {}


  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    limits: {
        fileSize: 2 * 1024 * 1024 // 2MB
    }
  }))
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<string> {
    const fileName = await this.fileService.storeFile(file);
    return `File ${fileName} uploaded successfully`;
  }
}
