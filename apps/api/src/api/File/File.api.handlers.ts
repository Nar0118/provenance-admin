import { NextFunction } from 'express';
import { Storage } from '@google-cloud/storage';
import { format } from 'util';

const keyFilename = 'apps/api/src/myKeys.json';

const projectId = 'provenance-admin-378509';
const bucketName = 'art-demo';

const storage = new Storage({
  projectId,
  keyFilename,
});
const bucket = storage.bucket(bucketName);

export const uploadFile = async (
  req,
  res,
  next: NextFunction
): Promise<void> => {
  const blob = bucket.file(req.file.originalname);
  const blobStream = blob.createWriteStream();
  blobStream.on('error', (err) => {
    next(err);
  });

  blobStream.on('finish', (): void => {
    const url = `https://storage.cloud.google.com/${bucket.name}/${blob.name}`;
    const publicUrl = format(url);
    res.status(200).send(publicUrl);
  });

  blobStream.end(req.file.buffer);
};

export const removeFile = async (url: string): Promise<void> => {
  storage.bucket(bucketName).file(url).delete({ ignoreNotFound: true });
};
