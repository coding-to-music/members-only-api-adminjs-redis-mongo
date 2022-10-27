import { Request, Response, NextFunction } from 'express';
import { param, validationResult } from 'express-validator';
import {
    LoggerException,
    NotFoundException,
    ValidationException
} from '@exceptions/common.exception';
import { getBucket } from '@config/database';
import { getFileStorage } from '@middlewares/multer';
import { logger } from '@utils/logger';
import { SuccessResponse } from '@utils/lib';


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

    public getMediaFile = [

        param('filename', 'File name is required').notEmpty().trim().escape(),

        async (req: Request, res: Response, next: NextFunction) => {
            try {

                const errors = validationResult(req);
                if (!errors.isEmpty()) throw new ValidationException(errors.array());

                const { filename } = req.params

                const bucket = getBucket()

                const mediaFile = await bucket.find({ filename }).toArray()

                if (!mediaFile.length) throw new NotFoundException(`File with ${filename} does not exist`)

                res.header("Cross-Origin-Opener-Policy", "cross-origin");
                res.header("Cross-Origin-Resource-Policy", "cross-origin");

                bucket.openDownloadStreamByName(filename).pipe(res)

            } catch (error: any) {
                logger.error(JSON.stringify(new LoggerException(error, req)), error);
                next(error)
            }
        }

    ]


    public deleteMediaFile = [

        param('filename', 'File name is required').notEmpty().trim().escape(),

        async (req: Request, res: Response, next: NextFunction) => {
            try {

                const errors = validationResult(req);
                if (!errors.isEmpty()) throw new ValidationException(errors.array());

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
    ]

};