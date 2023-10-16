import { Injectable, Res } from '@nestjs/common';
import { createWriteStream } from 'fs';
import * as fsExtra from 'fs-extra';
import * as path from 'path';
import { join } from 'path';

@Injectable()
export class FileService {
  constructor() {}

  async storeFile(file: Express.Multer.File): Promise<string> {
    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = path.join('linker_external', 'public', fileName);
    const publicUrl = this.getPublicUrl(fileName);

    // Create the directory if it doesn't exist
    await fsExtra.ensureDir(path.dirname(filePath));

    return new Promise((resolve, reject) => {
      const writeStream = createWriteStream(filePath);

      writeStream.on('finish', () => resolve(publicUrl));
      writeStream.on('error', (error) => reject(error));

      writeStream.write(file.buffer);
      writeStream.end();
    });
  }

  async storeFileStream(
    fileStream: NodeJS.ReadableStream,
    originalname: string,
  ): Promise<string> {
    const fileName = `${Date.now()}-${originalname}`;
    const filePath = path.join('linker_external', 'public', fileName);
    const publicUrl = this.getPublicUrl(fileName);

    // Create the directory if it doesn't exist
    await fsExtra.ensureDir(path.dirname(filePath));

    return new Promise((resolve, reject) => {
      const writeStream = createWriteStream(filePath);

      fileStream.pipe(writeStream);

      writeStream.on('finish', () => resolve(publicUrl));
      writeStream.on('error', (error) => reject(error));
    });
  }

  private getPublicUrl(fileName: string): string {
    const baseUrl = process.env.BASE_URL; // Set your base URL in configuration
    return `${baseUrl}/public/${fileName}`; // Update the path based on your file storage setup
  }

  async getFile(fileName: string, @Res() res): Promise<any> {
    return res.sendFile(
      join(process.cwd(), 'linker_external/public/' + fileName),
    );
  }

  async deleteFile(fileName: string): Promise<any> {
    fileName = fileName.replace(process.env.BASE_URL + '/public/', '');
    return fsExtra.remove(
      join(process.cwd(), 'linker_external/public/' + fileName),
    );
  }
}
