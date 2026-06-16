import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  CreateBucketCommand,
  PutBucketPolicyCommand,
  HeadBucketCommand,
} from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import * as path from 'path';

const BUCKETS = ['products', 'avatars'] as const;

@Injectable()
export class FilesService implements OnModuleInit {
  private readonly logger = new Logger(FilesService.name);
  private readonly s3: S3Client;
  private readonly publicUrl: string;

  constructor(private config: ConfigService) {
    const endpoint = config.get<string>('MINIO_ENDPOINT', 'localhost');
    const port = config.get<number>('MINIO_PORT', 9000);
    const useSSL = config.get<string>('MINIO_USE_SSL', 'false') === 'true';

    this.publicUrl = config.get<string>('MINIO_PUBLIC_URL', `http://${endpoint}:${port}`);

    this.s3 = new S3Client({
      endpoint: `${useSSL ? 'https' : 'http'}://${endpoint}:${port}`,
      region: 'us-east-1',
      credentials: {
        accessKeyId: config.get<string>('MINIO_ACCESS_KEY', 'minioadmin'),
        secretAccessKey: config.get<string>('MINIO_SECRET_KEY', 'minioadmin'),
      },
      forcePathStyle: true,
    });
  }

  async onModuleInit() {
    for (const bucket of BUCKETS) {
      await this.ensureBucket(bucket);
    }
  }

  async upload(
    bucket: (typeof BUCKETS)[number],
    file: Express.Multer.File,
  ): Promise<string> {
    const ext = path.extname(file.originalname);
    const key = `${randomUUID()}${ext}`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ContentLength: file.size,
      }),
    );

    return `${this.publicUrl}/${bucket}/${key}`;
  }

  async deleteByUrl(url: string): Promise<void> {
    // url: http://host:port/bucket/key
    const parsed = new URL(url);
    const parts = parsed.pathname.split('/').filter(Boolean);
    if (parts.length < 2) return;
    const [bucket, ...rest] = parts;
    const key = rest.join('/');

    await this.s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
  }

  private async ensureBucket(bucket: string) {
    try {
      await this.s3.send(new HeadBucketCommand({ Bucket: bucket }));
    } catch {
      try {
        await this.s3.send(new CreateBucketCommand({ Bucket: bucket }));
        // Make bucket public (read-only)
        const policy = JSON.stringify({
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Principal: { AWS: ['*'] },
              Action: ['s3:GetObject'],
              Resource: [`arn:aws:s3:::${bucket}/*`],
            },
          ],
        });
        await this.s3.send(
          new PutBucketPolicyCommand({ Bucket: bucket, Policy: policy }),
        );
        this.logger.log(`Created bucket: ${bucket}`);
      } catch (e) {
        this.logger.warn(`Could not create bucket ${bucket}: ${(e as Error).message}`);
      }
    }
  }
}
