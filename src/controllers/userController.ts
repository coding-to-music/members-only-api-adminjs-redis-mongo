import User from '@models/User';
import { body, validationResult } from 'express-validator';
import gravatar from 'gravatar';
import { Request, Response, NextFunction } from 'express';
import { RequestWithUser } from '@interfaces/users.interface';
import Post from '@models/Post';
import Profile from '@models/Profile';
import { Types } from 'mongoose';
import { getCacheKey, setCacheKey } from '@config/cache';

export const get_all_users = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
        const value = await getCacheKey('all_users')
        if (value) return res.status(200).json({ fromCache: true, data: JSON.parse(value) });
        const users = await User.find({}).exec();
        await setCacheKey('all_users', users);
        res.status(200).json({ fromCache: false, data: users });
    } catch (error) {
        next(error);
    }
};

export const get_user = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
        const { password, resetPassword, refreshToken, tokenVersion, ...data } = req.user._doc;
        res.json(data)
    } catch (error) {
        next(error)
    }
}

export const post_create_user = [

    body('email').notEmpty().isEmail(),
    body('firstName', 'First Name is Required').trim().isLength({ min: 1 }).escape(),
    body('lastName', 'Last Name is Required').trim().isLength({ min: 1 }).escape(),
    body('confirmPassword').notEmpty().isLength({ min: 6 }),

    async (req: Request, res: Response, next: NextFunction) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        try {
            const { email, firstName, lastName, confirmPassword, img } = req.body;

            const foundUser = await User.findOne({ email: email }).exec();
            if (foundUser) return res.status(409).json({ msg: 'User already exists' });

            const avatar = gravatar.url(email, { s: '100', r: 'pg', d: 'retro' }, true);

            const user = new User({
                name: firstName + lastName,
                email: email,
                password: confirmPassword,
                avatar: avatar || img || ''
            });

            await user.save();

            const { password, resetPassword, refreshToken, ...data } = user._doc;
            res.json({ message: 'Success, User Account Created', newUser: data });
        } catch (error) {
            next(error)
        }
    }
];

export const put_update_user = [

    async (req: Request, res: Response, next: NextFunction) => {
        res.send('NOT YET IMPLEMENTED')
    }
]

export const delete_delete_user = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {

        await Post.deleteMany({ user: req.user._id }).exec();

        const userPostComments = await Post.find({}).elemMatch('comments', { comment_user: req.user._id }).exec();
        if (userPostComments.length) {
            userPostComments.forEach(async post => {
                const commentIndex = post.comments.findIndex(comment => comment.comment_user.equals(new Types.ObjectId(req.user._id)));
                if (commentIndex !== -1) {
                    post.comments.splice(commentIndex, 1);
                    await post.save();
                }
            });
        };

        const userPostLikes = await Post.find({}).elemMatch('likes', { like_user: req.user._id }).exec();
        if (userPostLikes.length) {
            userPostLikes.forEach(async post => {
                const likeIndex = post.likes.findIndex(like => like.like_user.equals(new Types.ObjectId(req.user._id)));
                if (likeIndex !== -1) {
                    post.likes.splice(likeIndex, 1);
                    await post.save();
                }
            });
        }

        await Profile.deleteOne({ user: req.user._id }).exec();

        await User.deleteOne({ _id: req.user._id }).exec();

        res.status(200).json({ msg: 'User deleted successfully' });

    } catch (error) {
        next(error)
    }
}