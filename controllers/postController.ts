import Post from '@models/Post';
import { body, validationResult } from 'express-validator';
import { Response, NextFunction, Request } from 'express';
import { RequestWithUser } from '@interfaces/users.interface';
import { formatPostComment } from '@utils/services';

export const post_create_post = [
    (req: Request, res: Response, next: NextFunction) => formatPostComment(req, res, next),

    body('postContent').not().isEmpty().withMessage('Post content cannot be empty'),

    async (req: RequestWithUser, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
        try {
            const post = new Post({
                user: req.user._id,
                post_content: req.body.postContent
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
    (req: Request, res: Response, next: NextFunction) => formatPostComment(req, res, next),

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