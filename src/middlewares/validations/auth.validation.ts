import { NextFunction, Request, Response } from 'express';
import { body } from 'express-validator';
import { checkValidations } from '@utils/checkValidations';


export class AuthRequestValidator {

    public loginUserValidator = [

        body('email').notEmpty().isEmail().withMessage('Email is required and must be a valid email'),

        body('password').notEmpty().isLength({ min: 6 }).withMessage('Password is required and must be at least 6 characters long'),

        async (req: Request, res: Response, next: NextFunction) => {
            checkValidations(req, res, next)
        }
    ];

    public verifyTwofactorValidator = [

        body('otpToken', 'OTP Token is Required').notEmpty().isLength({ min: 6, max: 6 }).withMessage('Token must be six characters long').trim().escape(),

        async (req: Request, res: Response, next: NextFunction) => {
            checkValidations(req, res, next)
        }
    ];

    public loginValidateTwoFactorValidator = [

        body('email').notEmpty().isEmail().withMessage('Email is required and must be a valid email').trim().escape(),

        body('otpToken', 'OTP Token is Required').notEmpty().isLength({ min: 6, max: 6 }).withMessage('Token must be six characters long').trim().escape(),

        async (req: Request, res: Response, next: NextFunction) => {
            checkValidations(req, res, next)
        }
    ]
}