import { body, validationResult } from 'express-validator';
import { NextFunction, Request, Response } from 'express';
import { RequestWithUser } from '@interfaces/users.interface';
import { logger } from '@utils/logger';
import { PasswordService } from '@services/password.service';
import { SuccessResponse } from '@utils/lib';
import { LoggerException, ValidationException } from '@exceptions/common.exception';

export class PasswordController {

    private passwordService = new PasswordService()

    public getVerificationCode = [

        body('email').notEmpty().isEmail(),

        async (req: Request, res: Response, next: NextFunction) => {
            try {

                const errors = validationResult(req);
                if (!errors.isEmpty()) throw new ValidationException(errors.array());

                const { email } = req.body;

                await this.passwordService.getVerificationCode(email)

                res.json(new SuccessResponse(200, 'Verification Code sent'));

            } catch (error: any) {
                logger.error(JSON.stringify(new LoggerException(error, req)), error);
                next(error)
            }
        }
    ];

    public putResetPassword = [

        body('email').notEmpty().isEmail(),

        body('new_password').notEmpty().isLength({ min: 6 }),

        body('verification_code').notEmpty().isLength({ min: 6 }).withMessage('must be at least 6 chars long'),

        async (req: Request, res: Response, next: NextFunction) => {
            try {

                const errors = validationResult(req);
                if (!errors.isEmpty()) throw new ValidationException(errors.array());

                const { body } = req;

                const data = await this.passwordService.resetPassword(body);

                res.json(new SuccessResponse(200, 'Password Reset Successful', data));

            } catch (error: any) {
                logger.error(JSON.stringify(new LoggerException(error, req)), error);
                next(error)
            }
        }
    ];

    public putChangePassword = [

        body('old_password').notEmpty().isLength({ min: 6 }),

        body('new_password').notEmpty().isLength({ min: 6 }),

        async (req: RequestWithUser, res: Response, next: NextFunction) => {
            try {

                const errors = validationResult(req);
                if (!errors.isEmpty()) throw new ValidationException(errors.array());

                const { old_password, new_password } = req.body;

                const { _id } = req.user;

                const data = await this.passwordService.changePassword(_id, old_password, new_password);

                res.json(new SuccessResponse(200, 'Password Changed', data))

            } catch (error: any) {
                logger.error(JSON.stringify(new LoggerException(error, req)), error);
                next(error)
            }
        }
    ]
};