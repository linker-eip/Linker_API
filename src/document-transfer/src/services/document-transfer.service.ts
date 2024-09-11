import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentResult } from '../types/document-result.type';
import { getRandomString } from '../helpers/random.helper';
import * as sharp from 'sharp';

@Injectable()
export class DocumentTransferService {
  private readonly s3Region: string;
  private readonly s3Bucket: string;
  private readonly s3Client: S3Client;

  constructor(private readonly configService: ConfigService) {
    this.s3Region = this.configService.get<string>('AWS_S3_REGION');
    this.s3Bucket = this.configService.get<string>('AWS_S3_BUCKET');
    this.s3Client = new S3Client({
      region: this.s3Region,
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>(
          'AWS_SECRET_ACCESS_KEY',
        ),
      },
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        const metadata = await sharp(file.buffer).metadata();
        const width = metadata.width;
        const height = metadata.height;

        if (!width || !height) {
          throw new Error('Unable to determine image dimensions');
        }

        const key = getRandomString(48);
        const url = `https://${this.s3Bucket}.s3.${this.s3Region}.amazonaws.com/${key}`;

        const outputBuffer = await sharp(file.buffer)
          .resize(width, height, { fit: 'cover' })
          .jpeg({ quality: 90 })
          .toBuffer();

        await this.s3Client.send(
          new PutObjectCommand({
            Bucket: this.s3Bucket,
            Key: key,
            Body: outputBuffer,
            ContentType: file.mimetype,
          }),
        );

        resolve(url);
      } catch (error) {
        reject(error);
      }
    });
  }

  async uploadFileNotImage(file: Express.Multer.File): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        const key = getRandomString(48);
        const url = `https://${this.s3Bucket}.s3.${this.s3Region}.amazonaws.com/${key}`;

        await this.s3Client.send(
          new PutObjectCommand({
            Bucket: this.s3Bucket,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
          }),
        );

        resolve(url);
      } catch (error) {
        reject(error);
      }
    });
  }

  async deleteFile(key: string): Promise<void> {
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.s3Bucket,
        Key: key,
      }),
    );
  }
}
