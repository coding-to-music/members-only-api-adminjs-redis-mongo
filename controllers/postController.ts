import Post from '@models/Post';
import { body, validationResult } from 'express-validator';
import { Response, NextFunction, Request } from 'express';
import { RequestWithUser } from '@interfaces/users.interface';
import { formatPostComment, Comment } from '@utils/lib';
import mongoose from 'mongoose';

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

export const put_add_comments = [

    body('comment').not().isEmpty().withMessage('Comment cannot be empty'),

    async (req: RequestWithUser, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

        try {
            const post = await Post.findById(req.params.id).exec();
            if (!post) return res.status(404).json({ msg: 'Post not found' });

            const userId = new mongoose.Types.ObjectId(req.user._id);
            switch (true) {
                case !post.comments.length:
                    const comments = new Comment(userId, [{ comment: req.body.comment, comment_date: new Date(Date.now()) }]);
                    post.comments = [...post.comments, comments];
                    await post.save();
                    break;
                case post.comments.some(comment => comment.comment_user === userId):
                    post.comments.filter(comment => comment.comment_user === userId)[0].comment_list.push({ comment: req.body.comment, comment_date: new Date(Date.now()) });
                    await post.save();
                    break;
            }
            
            res.status(200).json({ message: 'Comment added successfully', post });

        } catch (error) {
            console.error(error);
            return next(error);
        }
    }
];

export const put_add_likes = [
    (req: Request, res: Response, next: NextFunction) => formatPostComment(req, res, next),

    body('comments.*').escape(),
    body('likes.*').escape(),

    async (req: RequestWithUser, res: Response, next: NextFunction) => {
        return res.json({ message: 'Not implemented' });
    }
];