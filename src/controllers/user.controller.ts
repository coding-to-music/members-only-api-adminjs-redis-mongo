import { NextFunction, Request, Response } from 'express';
import { RequestWithUser } from '@interfaces/users.interface';
import { LoggerException } from '@exceptions/common.exception';
import { logger } from '@utils/logger';
import { UserService } from '@services/user.service';
import { SuccessResponse } from '@utils/lib';


export class UserController {

    private readonly userService = new UserService();

    public async getAllUsers(req: RequestWithUser, res: Response, next: NextFunction) {
        try {

            const allUsers = this.userService.getAllUsers()

            res.status(200).json(new SuccessResponse(200, 'All Users', allUsers));

        } catch (error: any) {
            logger.error(JSON.stringify(new LoggerException(error, req)), error);
            next(error)
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

        } catch (error: any) {
            logger.error(JSON.stringify(new LoggerException(error, req)), error);
            next(error)
        }
    }

    public createUser = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const { body } = req;

            await this.userService.createUser(body);

            res.json(new SuccessResponse(201, 'Success, User Account Created'))

        } catch (error: any) {
            logger.error(JSON.stringify(new LoggerException(error, req)), error);
            next(error)
        }
    }

    public updateUser = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {

            const { body } = req
            const { _id } = req.user

            await this.userService.updateUser(_id, body)

            res.status(200).json(new SuccessResponse(200, 'User Updated'))

        } catch (error: any) {
            logger.error(JSON.stringify(new LoggerException(error, req)), error);
            next(error)
        }
    }

    public deleteUser = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {

            const { _id } = req.user;

            await this.userService.deleteUser(_id);

            res.status(200).json(new SuccessResponse(200, 'User Deleted'));

        } catch (error: any) {
            logger.error(JSON.stringify(new LoggerException(error, req)), error);
            next(error)
        }
    }

};