import Profile from '../models/Profile.mjs';
import { body, validationResult } from "express-validator";

export const get_userProfile = async (req, res, next) => {
    try {
        const profile = await Profile.findOne({ user: req.user._id }).exec();
        if (!profile) return res.status(404).json({ message: `No profile found for :- ${req.user.name}` });
        res.json({ profile });
    } catch (err) {
        if (err) return next(err);
    }
}