import { Request, Response, NextFunction } from "express";
import { getBucket } from "@config/database";
import { Controller } from "@shared/decorators/common.decorator";
import { LoggerException, NotFoundException, } from "@shared/exceptions/common.exception";
import { getFileStorage } from "@shared/middlewares/multer";
import { logger } from "@utils/logger";
import { SuccessResponse } from "@utils/httpResponse";


@Controller()
export class MediaController {

    private mediaUploads = getFileStorage();

    public uploadMedia = [

        this.mediaUploads.single('file'),

        async (req: Request, res: Response, next: NextFunction) => {
            try {

                return res.status(200).json(new SuccessResponse(200, 'File Uploaded'))

            } catch (error: any) {
                logger.error(JSON.stringify(new LoggerException(error, req)), error);
                next(error)
            }
        }
    ];

    public getMediaFile = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const { filename } = req.params

            const bucket = getBucket()

            const mediaFile = await bucket.find({ filename }).toArray()

            if (!mediaFile.length) throw new NotFoundException(`File with ${filename} does not exist`)

            res.header('Cross-Origin-Opener-Policy', 'cross-origin');
            res.header('Cross-Origin-Resource-Policy', 'cross-origin');

            bucket.openDownloadStreamByName(filename).pipe(res)

        } catch (error: any) {
            logger.error(JSON.stringify(new LoggerException(error, req)), error);
            next(error)
        }
    }


    public deleteMediaFile = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const { filename } = req.params;

            const bucket = getBucket();

            const mediaFile = await bucket.find({ filename }).toArray();

            if (!mediaFile.length) throw new NotFoundException(`File with ${filename} does not exist`);

            await bucket.delete(mediaFile[0]._id);

            res.status(200).json(new SuccessResponse(200, 'File Deleted'));

        } catch (error: any) {
            logger.error(JSON.stringify(new LoggerException(error, req)), error);
            next(error)
        }
    }

};