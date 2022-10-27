import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { LoggerException, ValidationException } from '@exceptions/common.exception';
import { logger } from '@utils/logger';
import { formatPostCommentsAndLikes } from '@utils/lib';


export class PostRequestValidator {

    private checkValidations(req: Request, res: Response, next: NextFunction) {
        try {

            const errors = validationResult(req);

            if (errors.isEmpty()) {

                next()

            } else {

                throw new ValidationException(errors.array());

            }

        } catch (error: any) {
            logger.error(JSON.stringify(new LoggerException(error, req)), error);
            next(error)
        }
    }

    public createPostValidator = [

        (req: Request, res: Response, next: NextFunction) => formatPostCommentsAndLikes(req, res, next),

        body('postTitle').not().isEmpty().withMessage('Post Title cannot be empty').isLength({ min: 3, max: 30 }).withMessage('Post Title be between 3 to 30 characters '),

        body('postContent').not().isEmpty().withMessage('Post content cannot be empty').isLength({ min: 10 }).withMessage('Post Content must contain at least 10 characters'),

        async (req: Request, res: Response, next: NextFunction) => {
            this.checkValidations(req, res, next)
        }
    ];

}