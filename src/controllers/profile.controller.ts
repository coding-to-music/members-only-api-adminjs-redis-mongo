import { NextFunction, Response } from 'express';
import { RequestWithUser } from '@interfaces/users.interface';
import { SuccessResponse } from '@utils/lib';
import { LoggerException } from '@exceptions/common.exception';
import { logger } from '@utils/logger'
import { ProfileService } from '@services/profile.service';


export class ProfileController {

    private readonly profileService: ProfileService;

    constructor() {
        this.profileService = new ProfileService();
    }

    public getProfile = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {

            const { _id: userID } = req.user

            const data = await this.profileService.getUserProfile(userID)

            res.status(200).json(new SuccessResponse(200, 'User Profile', data));

        } catch (error: any) {
            logger.error(JSON.stringify(new LoggerException(error, req)), error);
            next(error)
        }
    };

    public createProfile = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {

            const { body } = req;

            const { _id: userID } = req.user;

            const data = await this.profileService.createProfile(userID, body)

            res.status(201).json(new SuccessResponse(201, 'Profile Created', data));

        } catch (error: any) {
            logger.error(JSON.stringify(new LoggerException(error, req)), error);
            next(error)
        }
    }

}