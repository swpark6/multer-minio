import { Request } from 'express';
import { StorageEngine } from 'multer';

import * as Minio from 'minio';
import { ResultCallback } from 'minio/dist/main/internal/type';

export class MinioStorage implements StorageEngine {
  constructor(
    private readonly minioClient: Minio.Client,
    private readonly bucketName: string,
  ) {}

  _handleFile(
    req: Request,
    file: Express.Multer.File,
    cb: (
      error?: unknown,
      info?: Partial<ResultCallback<Minio.UploadedObjectInfo>>,
    ) => void,
  ): void {
    const objectName = file.filename;

    const metadata = {
      ...(file.mimetype && { 'Content-Type': file.mimetype }), // set Content-Type
    };

    this.minioClient
      .putObject(this.bucketName, objectName, file.stream, metadata)
      .then((result) => cb(null, result))
      .catch((err) => cb(err));
  }

  _removeFile(
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null) => void,
  ): void {
    this.minioClient
      .removeObject(this.bucketName, file.filename)
      .then(() => cb(null))
      .catch((error) => cb(error));
  }
}
