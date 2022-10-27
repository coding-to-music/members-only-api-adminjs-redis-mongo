import { NextFunction, Request, Response } from 'express';
import { body } from 'express-validator';
import { BadRequestException } from '@exceptions/common.exception';
import { checkValidations } from '@utils/checkValidations';


export class UserRequestValidator {

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
            checkValidations(req, res, next)
        }
    ];

    public updateUserValidator = [

        body('firstName', 'First Name is Required').trim().isLength({ min: 1 }).escape(),

        body('lastName', 'Last Name is Required').trim().isLength({ min: 1 }).escape(),

        async (req: Request, res: Response, next: NextFunction) => {
            checkValidations(req, res, next)
        }
    ];

}