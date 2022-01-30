import Profile from '@models/Profile';
import { body } from "express-validator";
import { Response, NextFunction } from 'express';
import { RequestWithUser } from '@interfaces/users.interface';
import { formatProifleBody, handleValidationErrors } from '@utils/lib';

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

    body('bio').not().isEmpty().withMessage('Bio cannot be empty'),
    body('address').not().isEmpty().withMessage('Address cannot be empty'),
    body('phoneNumber').not().isEmpty().withMessage('Phone number cannot be empty'),
    body('education').not().isEmpty().withMessage('Education cannot be empty'),
    body('education.school').not().isEmpty().withMessage('School cannot be empty'),
    body('education.degree').not().isEmpty().withMessage('Degree cannot be empty'),
    body('education.field').not().isEmpty().withMessage('Field cannot be empty'),
    body('education.from').not().isEmpty().withMessage('From cannot be empty'),
    body('education.to').not().isEmpty().withMessage('To cannot be empty'),
    body('education.current').not().isEmpty().withMessage('Current cannot be empty'),
    body('experience').not().isEmpty().withMessage('Experience cannot be empty'),
    body('experience.jobTitle').not().isEmpty().withMessage('Job title cannot be empty'),
    body('experience.company').not().isEmpty().withMessage('Company cannot be empty'),
    body('experience.location').not().isEmpty().withMessage('Location cannot be empty'),
    body('experience.from').not().isEmpty().withMessage('From cannot be empty'),
    body('experience.to').not().isEmpty().withMessage('To cannot be empty'),
    body('experience.description').not().isEmpty().withMessage('Current cannot be empty'),
    body('social').not().isEmpty().withMessage('Social cannot be empty'),
    body('social.github').not().isEmpty().withMessage('Github cannot be empty'),
    body('social.linkedin').not().isEmpty().withMessage('Linkedin cannot be empty'),
    body('social.twitter').not().isEmpty().withMessage('Twitter cannot be empty'),

    async (req: RequestWithUser, res: Response, next: NextFunction) => {
        handleValidationErrors(req, res);

        try {
            
            const profile = new Profile({
                user: req.user._id,
                bio: req.body.bio,
                address: req.body.address,
                phoneNumber: +req.body.phoneNumber,
                education: req.body.education,
                experience: req.body.experience,
                social: req.body.social,
            });

            await profile.save();
            res.status(201).json({
                message: 'Profile created successfully',
                profile
            });
        } catch (err) {
            if (err instanceof Error) {
                console.error(err);
                next(err);
            }
        }
    }
]