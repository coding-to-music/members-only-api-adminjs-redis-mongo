import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { RequestWithUser } from '@interfaces/users.interface';
import {
    BadRequestException,
    ValidationException,
} from '@exceptions/common.exception';
import { logger } from '@utils/logger';

import { UserService } from '@services/user.service';
import { SuccessResponse } from '@utils/lib';

export class UserController {

    private readonly userService = new UserService();

    public async getAllUsers(req: RequestWithUser, res: Response, next: NextFunction) {
        try {

            const allUsers = this.userService.getAllUsers()

            res.status(200).json(new SuccessResponse(200, 'All Users', allUsers));

        } catch (err: any) {

            logger.error(`
                ${err.statusCode || 500} - 
                ${err.error || 'Something Went Wrong'} - 
                ${req.originalUrl} - 
                ${req.method} - 
                ${req.ip}
                `);
            next(err);
        }
    };

    public async getCurrentUser(req: RequestWithUser, res: Response, next: NextFunction) {
        try {

            const {
                password,
                resetPassword,
                refreshToken,
                tokenVersion,
                twoFactor,
                ...data
            } = req.user._doc;

            res.json(new SuccessResponse(200, 'User details', data))

        } catch (err: any) {

            logger.error(`
                ${err.statusCode || 500} - 
                ${err.error || 'Something Went Wrong'} - 
                ${req.originalUrl} - 
                ${req.method} - 
                ${req.ip}
                `);

            next(err)
        }
    }

    public postCreateUser = [

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

            try {

                const errors = validationResult(req);
                if (!errors.isEmpty()) throw new ValidationException(errors.array());

                const { body } = req;

                await this.userService.createUser(body);

                res.json(new SuccessResponse(201, 'Success, User Account Created'))

            } catch (err: any) {

                logger.error(`
                ${err.statusCode || 500} - 
                ${err.error || 'Something Went Wrong'} - 
                ${req.originalUrl} - 
                ${req.method} - 
                ${req.ip}
                `);
                next(err)
            }
        }
    ];

    public putUpdateUser = [

        body('firstName', 'First Name is Required').trim().isLength({ min: 1 }).escape(),

        body('lastName', 'Last Name is Required').trim().isLength({ min: 1 }).escape(),

        async (req: RequestWithUser, res: Response, next: NextFunction) => {
            try {

                const { body } = req
                const { _id } = req.user

                await this.userService.updateUser(_id, body)

                res.status(200).json(new SuccessResponse(200, 'NOT YET UPDATED'))

            } catch (err: any) {

                logger.error(`
                ${err.statusCode || 500} - 
                ${err.error || 'Something Went Wrong'} - 
                ${req.originalUrl} - 
                ${req.method} - 
                ${req.ip}
                `);
                next(err)
            }

        }
    ]

    public deleteUser = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {

            const { _id } = req.user;

            await this.userService.deleteUser(_id);

            res.status(200).json(new SuccessResponse(200, 'User deleted successfully'));

        } catch (err: any) {

            logger.error(`
                ${err.statusCode || 500} - 
                ${err.error || 'Something Went Wrong'} - 
                ${req.originalUrl} - 
                ${req.method} - 
                ${req.ip}
                `);
            next(err)
        }
    }

};