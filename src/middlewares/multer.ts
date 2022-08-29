import { Request } from 'express';
import multer from 'multer'
import { GridFsStorage } from 'multer-gridfs-storage'
import { ENV } from '@utils/validateEnv';

export const getFileStorage = () => {

    const storage = new GridFsStorage({
        url: ENV.DB_URL,
        file: (req: Request, file) => {
            return {
                bucketName: 'uploads',
                filename: file.originalname
            }
        }
    });

    return multer({ storage });
}