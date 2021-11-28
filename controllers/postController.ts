import Post from '@models/Post';
import { body, validationResult } from 'express-validator';
import { Response, NextFunction, Request } from 'express';
import { RequestWithUser } from '@/interfaces/users.interface';

export const post_create_post = [

    body('twit').not().isEmpty().withMessage('Twit is required'),

    async (req: RequestWithUser, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        try {
            const post = new Post({
                user: req.user._id,
                twit: req.body.twit
            });
            await post.save();
            res.status(201).json({
                message: 'Post created successfully',
                post
            });
        } catch (err) {
            if (err instanceof Error) {
                console.error(err);
                return next(err);
            }
        }
    }
];

export const put_update_post = [
    (req: Request, res: Response, next: NextFunction) => {
        switch (true) {
            case !req.body.comments:
                req.body.comments = []
                break;
            case !(req.body.comments instanceof Array):
                req.body.comments = new Array(req.body.comments);
                break;
            case !req.body.likes:
                req.body.likes = []
                break;
            case !(req.body.likes instanceof Array):
                req.body.likes = new Array(req.body.likes);
        }
        next()
    },

    body('comments.*').escape(),
    body('likes.*').escape(),

    async (req: RequestWithUser, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        } else {
            try {
                const post = await Post.findById(req.params.id).populate('user').exec();
                if (!post) return res.status(404).json({ msg: 'Post not found' });
                if (post.user.id !== req.user._id) return res.status(403).json({ msg: 'You are not authorized to edit this post' });

            } catch (error) {
                if (error instanceof Error) {
                    console.error(error);
                    return next(error);
                }
            }
        }
    }
];