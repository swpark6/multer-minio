import { Request } from 'express';
import * as Minio from 'minio';
import { Readable } from 'stream';
import { MinioStorage } from '../src/index';

describe('Express multer', () => {
  it('stdout', () => {
    const buffer = Buffer.from('TEST_FILE');

    const file: Express.Multer.File = {
      fieldname: 'NAME',
      filename: 'NAME',
      originalname: 'file.csv',
      mimetype: 'text/csv',
      path: 'something',
      buffer: buffer,
      stream: Readable.from(buffer),
      size: 10,
      destination: '/dev/null',
      encoding: 'utf-8',
    };

    const endPoint = 'localhost';
    const port = 9000;
    const useSSL = false;
    const accessKey = 'user';
    const secretKey = 'password';

    const minioClient = new Minio.Client({
      endPoint,
      port,
      useSSL,
      accessKey,
      secretKey,
    });

    const sut = new MinioStorage(minioClient, 'multer');

    expect(sut).toBeDefined();

    sut._handleFile(new Object() as Request, file, (err, info) => {
      expect(info).toEqual({
        etag: expect.any(String),
        versionId: 1,
      });
    });
  });
});
