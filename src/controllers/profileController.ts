import { body, validationResult } from 'express-validator';
import { Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import Profile from '@models/Profile';
import { RequestWithUser } from '@interfaces/users.interface';
import { formatProifleBody } from '@utils/lib';
import {
    ConflictException,
    NotFoundException,
    ValidationException,
} from '@exceptions/commonExceptions';
import { logger } from '@utils/logger'


class ProfileController {

    public async getUserProfile(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            const profile = await Profile.findOne({ user: req.user._id }).exec();
            if (!profile) throw new NotFoundException(`No Profile found for ${req.user.name}`);
            res.json({ profile });
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

                const { _id } = req.user

                // Check if user already has a profile
                const isProfileExists = await Profile.findOne({ user: _id })
                if (!isProfileExists) throw new ConflictException('User Already has a Profile');

                const profileToCreate = new Profile({
                    user: new Types.ObjectId(_id),
                    bio: req.body.bio,
                    address: req.body.address,
                    phoneNumber: +req.body.phoneNumber,
                    education: req.body.education,
                    experience: req.body.experience,
                    social: req.body.social,
                });

                await profileToCreate.save();
                res.status(201).json({
                    message: 'Profile created successfully',
                    profileToCreate
                });
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

export default new ProfileController()