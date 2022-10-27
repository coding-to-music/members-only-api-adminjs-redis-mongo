import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import {
    BadRequestException,
    LoggerException,
    ValidationException
} from '@exceptions/common.exception';
import { logger } from '@utils/logger';


export class UserRequestValidator {

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

    public createUserValidator = [

        body('email').notEmpty().isEmail(),

        body('firstName', 'First Name is Required').trim().isLength({ min: 1 }).escape(),

        body('lastName', 'Last Name is Required').trim().isLength({ min: 1 }).escape(),

        body('password').isString().trim().isLength({ min: 6 }).withMessage('password must contain at least 6 characters').escape(),

        body('confirmPassword').custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new BadRequestException('confirmPassword must match password')
            }
            return true
        }),

        async (req: Request, res: Response, next: NextFunction) => {
            this.checkValidations(req, res, next)
        }
    ];

    public updateUserValidator = [

        body('firstName', 'First Name is Required').trim().isLength({ min: 1 }).escape(),

        body('lastName', 'Last Name is Required').trim().isLength({ min: 1 }).escape(),

        async (req: Request, res: Response, next: NextFunction) => {
            this.checkValidations(req, res, next)
        }
    ];

}