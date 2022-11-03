import { NextFunction, Response, Request } from 'express';
import { RequestWithUser } from '@interfaces/users.interface';
import { SuccessResponse } from '@utils/lib';
import { LoggerException } from '@exceptions/common.exception';
import { logger } from '@utils/logger'
import { AdminService } from '@services/admin.service';
import { Controller } from '@decorators/common.decorator';


@Controller()
export class AdminController {

    private readonly adminService: AdminService;

    constructor() {
        this.adminService = new AdminService()
    }

    public getAllPosts = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {

            const data = await this.adminService.getAllPosts();

            res.status(200).json(new SuccessResponse(200, 'All Posts', data));

        } catch (error: any) {
            logger.error(JSON.stringify(new LoggerException(error, req)), error);
            next(error)
        }
    };

    public getPostByID = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;

            const data = await this.adminService.getPostByID(id)

            res.status(200).json(new SuccessResponse(200, 'Post Details', data));

        } catch (error: any) {
            logger.error(JSON.stringify(new LoggerException(error, req)), error);
            next(error)
        }
    };


    public getAllProfiles = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {

            const data = await this.adminService.getAllProfiles();

            res.status(200).json(new SuccessResponse(200, 'All Profiles', data));

        } catch (error: any) {
            logger.error(JSON.stringify(new LoggerException(error, req)), error);
            next(error)
        }
    };

    public getProfileByID = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;

            const data = await this.adminService.getProfileByID(id)

            res.status(200).json(new SuccessResponse(200, 'Profile Details', data));

        } catch (error: any) {
            logger.error(JSON.stringify(new LoggerException(error, req)), error);
            next(error)
        }
    };

    public getAllUsers = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {

            const data = await this.adminService.getAllUsers();

            res.status(200).json(new SuccessResponse(200, 'All Users', data));

        } catch (error: any) {
            logger.error(JSON.stringify(new LoggerException(error, req)), error);
            next(error)
        }
    };

    public getUserByID = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;

            const data = await this.adminService.getUserByID(id)

            res.status(200).json(new SuccessResponse(200, 'User Details', data));

        } catch (error: any) {
            logger.error(JSON.stringify(new LoggerException(error, req)), error);
            next(error)
        }
    };

};