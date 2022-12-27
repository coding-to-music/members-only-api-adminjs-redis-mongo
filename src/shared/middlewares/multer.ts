import { ENV } from "@utils/loadEnv";
import { GridFsStorage } from "multer-gridfs-storage"
import { Request } from "express";
import multer from "multer"

export const getFileStorage = () => {

    const storage = new GridFsStorage({
        url: ENV.MONGO_URI,
        file: (req: Request, file) => {
            return {
                bucketName: 'uploads',
                filename: file.originalname
            }
        }
    });

    return multer({ storage });
}