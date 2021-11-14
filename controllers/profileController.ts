import Profile from '@models/Profile';
import { body, validationResult } from "express-validator";
import { Response, NextFunction } from 'express';
import { RequestWithUser } from '@/interfaces/users.interface';

export const get_userProfile = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
        const profile = await Profile.findOne({ user: req.user._id }).exec();
        if (!profile) return res.status(404).json({ message: `No profile found for :- ${req.user.name}` });
        res.json({ profile });
    } catch (err) {
        if (err) return next(err);
    }
}