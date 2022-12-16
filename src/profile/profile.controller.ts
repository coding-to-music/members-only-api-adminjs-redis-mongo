import { NextFunction, Response } from "express";
import { ProfileService } from "./profile.service";
import { Controller } from "@shared/decorators/common.decorator";
import { LoggerException } from "@shared/exceptions/common.exception";
import { RequestWithUser } from "@shared/interfaces/request.interface";
import { SuccessResponse } from "@utils/httpResponse";
import { logger } from "@utils/logger"

@Controller()
export class ProfileController {

    private readonly profileService: ProfileService;

    constructor() {
        this.profileService = new ProfileService();
    }

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

    public getProfileByUser = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {

            const { _id: userID } = req.user

            const data = await this.profileService.getProfileByUser(userID)

            res.status(200).json(new SuccessResponse(200, 'User Profile Retrieved', data));

        } catch (error: any) {
            logger.error(JSON.stringify(new LoggerException(error, req)), error);
            next(error)
        }
    };

    public updateProfile = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {

            const { body } = req
            const { _id } = req.user

            await this.profileService.updateProfile(_id, body)

            res.status(200).json(new SuccessResponse(200, 'Profile Updated'))

        } catch (error: any) {
            logger.error(JSON.stringify(new LoggerException(error, req)), error);
            next(error)
        }
    }

    public deleteProfile = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {

            const { _id } = req.user;

            await this.profileService.deleteProfile(_id);

            res.status(200).json(new SuccessResponse(200, 'Profile Deleted'));

        } catch (error: any) {
            logger.error(JSON.stringify(new LoggerException(error, req)), error);
            next(error)
        }
    }

}