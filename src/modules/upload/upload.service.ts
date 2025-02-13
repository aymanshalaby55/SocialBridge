import { S3 } from '@aws-sdk/client-s3';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileUpload } from 'graphql-upload-ts';
import { Upload } from '@aws-sdk/lib-storage';
import * as path from 'path';

@Injectable()
export class UploadService {
  private readonly awsS3: S3;
  public readonly S3_BUCKET_NAME: string;

  constructor(private readonly configService: ConfigService) {
    this.awsS3 = new S3({
      region: this.configService.getOrThrow('AWS_S3_REGION'),
      credentials: {
        accessKeyId: this.configService.getOrThrow('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.getOrThrow('AWS_SECRET_ACCESS_KEY'),
      },
    });

    this.S3_BUCKET_NAME = this.configService.get('AWS_S3_BUCKET_NAME');
  }

  async uploadFileToS3({
    folderName,
    file,
  }: {
    folderName: string;
    file: FileUpload;
  }) {
    const key = `${folderName}/${new Date().toISOString()}_${path.basename(
      file.filename,
    )}`.replace(/ /g, '');

    //? use another libaray for this...
    // const fileBuffer = await new Promise<Buffer>((resolve, reject) => {
    //   const chunks: Buffer[] = [];
    //   const stream = file.createReadStream();

    //   stream.on('data', (chunk) => chunks.push(chunk));
    //   stream.on('end', () => resolve(Buffer.concat(chunks)));
    //   stream.on('error', reject);
    // });

    try {
      const upload = new Upload({
        client: this.awsS3,
        params: {
          Bucket: this.S3_BUCKET_NAME,
          Key: key,
          Body: file.createReadStream(),
          ContentType: file.mimetype,
        },
      });

      await upload.done();
      return { key };
    } catch (error) {
      throw new BadRequestException(`File upload failed: ${error.message}`);
    }
  }
}
