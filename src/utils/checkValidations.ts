import { ValidationException, LoggerException } from '@exceptions/common.exception';
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { logger } from './logger';


export const checkValidations = (req: Request, res: Response, next: NextFunction) => {
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