import { body, validationResult } from "express-validator";
import { Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import Profile from '@models/Profile';
import { RequestWithUser } from '@interfaces/users.interface';
import { formatProifleBody } from '@utils/lib';
import { AppError } from "@src/errors/AppError";

export const get_user_profile = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
        const profile = await Profile.findOne({ user: req.user._id }).exec();
        if (!profile) return res.status(404).json({ message: `No profile found for :- ${req.user.name}` });
        res.json({ profile });
    } catch (err) {
        if (err) return next(err);
    }
};

export const post_create_profile = [
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

        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        try {

            const { _id } = req.user
            
            // Check if user already has a profile
            const isProfileExists = await Profile.findOne({ user: _id })
            if (isProfileExists) throw new AppError('User Already has a Profile', 409)

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
        } catch (err) {
            if (err instanceof Error) {
                console.error(err);
                next(err);
            }
        }
    }
]