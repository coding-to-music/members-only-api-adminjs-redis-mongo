import { Request, Response, NextFunction } from 'express';
import { param, validationResult } from 'express-validator';
import { NotFoundException, ValidationException } from '@src/exceptions/common.exception';
import { getBucket } from '@config/database';
import { getFileStorage } from '@middlewares/multer';
import { logger } from '@utils/logger';


class MediaController {

    private mediaUploads = getFileStorage();

    public uploadMedia = [

        this.mediaUploads.single('file'),

        async (req: Request, res: Response, next: NextFunction) => {
            try {
                return res.status(200).json({
                    status: 'success',
                    message: 'File Uploaded Successfully'
                })
            } catch (err: any) {
                logger.error(`
                ${err.statusCode ?? 500} - 
                ${err.error ?? 'Something Went Wrong'} - 
                ${req.originalUrl} - 
                ${req.method} - 
                ${req.ip}
                `);
                next(err);
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

            } catch (err: any) {
                logger.error(`
                ${err.statusCode ?? 500} - 
                ${err.error ?? 'Something Went Wrong'} - 
                ${req.originalUrl} - 
                ${req.method} - 
                ${req.ip}
                `);
                next(err);
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

                res.status(200).json({
                    status: 'success',
                    message: 'File Deleted Successfully'
                });

            } catch (err: any) {
                logger.error(`
                ${err.statusCode ?? 500} - 
                ${err.error ?? 'Something Went Wrong'} - 
                ${req.originalUrl} - 
                ${req.method} - 
                ${req.ip}
                `);
                next(err);
            }
        }

    ]

}

export default new MediaController()