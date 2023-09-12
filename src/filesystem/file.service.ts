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

    console.log('Uploaded file path:', filePath);

    return new Promise((resolve, reject) => {
      const writeStream = createWriteStream(filePath);

      writeStream.on('finish', () => resolve(publicUrl));
      writeStream.on('error', (error) => reject(error));

      writeStream.write(file.buffer);
      writeStream.end();
    });
  }

  private getPublicUrl(fileName: string): string {
    const baseUrl = 'localhost:8080'; // Set your base URL in configuration
    return `${baseUrl}/linker_external/public/${fileName}`; // Update the path based on your file storage setup
  }

  async getFile(fileName: string, @Res() res): Promise<any> {
    return res.sendFile(
      join(process.cwd(), 'linker_external/public/' + fileName),
    );
  }
}
