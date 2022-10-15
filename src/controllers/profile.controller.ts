import { NextFunction, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { Types } from 'mongoose';
import Profile from '@models/Profile';
import { RequestWithUser } from '@interfaces/users.interface';
import { formatProifleBody, SuccessResponse } from '@utils/lib';
import {
    ConflictException,
    NotFoundException,
    ValidationException,
} from '@exceptions/common.exception';
import { logger } from '@utils/logger'
import { ProfileService } from '@services/profile.service';


export class ProfileController {

    private readonly profileService = new ProfileService()

    public getUserProfile = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {

            const { _id: userID } = req.user

            const data = await this.profileService.getUserProfile(userID)

            res.status(200).json(new SuccessResponse(200, 'User Profile', data));

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
    };

    public postCreateProfile = [

        (req: RequestWithUser, res: Response, next: NextFunction) => formatProifleBody(req, res, next),

        body('bio').not().isEmpty().withMessage('Bio cannot be empty').trim().escape(),
        body('address').not().isEmpty().withMessage('Address cannot be empty').trim().escape(),
        body('phoneNumber').not().isEmpty().withMessage('Phone number cannot be empty'),

        // Handle validation for array of objects
        body('education').isArray({ min: 1 }).withMessage('Education must be an array'),
        body('education[*].*').trim().isLength({ min: 1 }).escape(),
        body('experience').isArray({ min: 1 }).withMessage('Experience must be an array'),
        body('experience[*].*').trim().isLength({ min: 1 }).escape(),

        body('social').not().isEmpty().withMessage('Social cannot be empty'),
        body('social.github').not().isEmpty().withMessage('Github cannot be empty'),
        body('social.linkedin').not().isEmpty().withMessage('Linkedin cannot be empty'),
        body('social.twitter').not().isEmpty().withMessage('Twitter cannot be empty'),

        async (req: RequestWithUser, res: Response, next: NextFunction) => {

            try {

                const errors = validationResult(req);

                if (!errors.isEmpty()) throw new ValidationException(errors.array());

                const { body } = req;

                const { _id: userID } = req.user;

                const data = await this.profileService.createProfile(userID, body)

                res.status(201).json(new SuccessResponse(201, 'Profile Created', data));

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
        }
    ]

}