import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { LoggerException, ValidationException } from '@exceptions/common.exception';
import { logger } from '@utils/logger';


export class AuthRequestValidator {

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

    public loginUserValidator = [

        body('email').notEmpty().isEmail().withMessage('Email is required and must be a valid email'),

        body('password').notEmpty().isLength({ min: 6 }).withMessage('Password is required and must be at least 6 characters long'),

        async (req: Request, res: Response, next: NextFunction) => {
            this.checkValidations(req, res, next)
        }
    ];

    public verifyTwofactorValidator = [

        body('otpToken', 'OTP Token is Required').notEmpty().isLength({ min: 6, max: 6 }).withMessage('Token must be six characters long').trim().escape(),

        async (req: Request, res: Response, next: NextFunction) => {
            this.checkValidations(req, res, next)
        }
    ];

    public loginValidateTwoFactorValidator = [

        body('email').notEmpty().isEmail().withMessage('Email is required and must be a valid email').trim().escape(),

        body('otpToken', 'OTP Token is Required').notEmpty().isLength({ min: 6, max: 6 }).withMessage('Token must be six characters long').trim().escape(),

        async (req: Request, res: Response, next: NextFunction) => {
            this.checkValidations(req, res, next)
        }
    ]
}