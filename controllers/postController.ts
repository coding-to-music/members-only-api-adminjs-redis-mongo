import Post from '@models/Post';
import { body } from 'express-validator';
import { Response, NextFunction, Request } from 'express';
import { RequestWithUser } from '@interfaces/users.interface';
import { formatPostCommentsAndLikes, handleValidationErrors } from '@utils/lib';
import { Comment, Like } from '@utils/classes';
import { Types } from 'mongoose';

export const get_get_all_posts = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
        const posts = await Post.find({}).exec();
        res.status(200).json(posts);
    } catch (error) {
        next(error);
    }
};

export const get_get_post_by_id = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
        const post = await Post.findById(req.params.id).exec();
        if (!post) return res.status(404).json({ msg: 'Post not found' });
        res.status(200).json(post);
    } catch (error) {
        next(error);
    }
};

export const get_all_post_by_user = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
        const posts = await Post.find({ user: req.user._id }).exec();
        if (!posts.length) return res.status(404).json({ msg: 'No posts found for this user' });
        res.status(200).json(posts);
    } catch (error) {
        next(error)
    }
}

export const post_create_post = [
    (req: Request, res: Response, next: NextFunction) => formatPostCommentsAndLikes(req, res, next),

    body('postContent').not().isEmpty().withMessage('Post content cannot be empty'),

    async (req: RequestWithUser, res: Response, next: NextFunction) => {

        handleValidationErrors(req, res);

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
                next(err);
            }
        }
    }
];

export const put_add_comments = [

    body('comment').not().isEmpty().withMessage('Comment cannot be empty'),

    async (req: RequestWithUser, res: Response, next: NextFunction) => {

        handleValidationErrors(req, res);

        try {
            const post = await Post.findById(req.params.id).exec();
            if (!post) return res.status(404).json({ msg: 'Post not found' });

            const userId = new Types.ObjectId(req.user._id);
            switch (true) {
                case !post.comments.length || !post.comments.find(comment => comment.comment_user.equals(userId)):
                    const comments = new Comment(userId, [{ comment: req.body.comment, comment_date: new Date(Date.now()) }]);
                    post.comments = [...post.comments, comments];
                    await post.save();
                    break;
                case post.comments.some(comment => comment.comment_user.equals(userId)):
                    const commentIndex: number = post.comments.findIndex(comment => comment.comment_user.equals(userId));
                    post.comments[commentIndex].comment_list = [...post.comments[commentIndex].comment_list, { comment: req.body.comment, comment_date: new Date(Date.now()) }];
                    await post.save();
                    break;
            };

            res.status(200).json({ message: 'Comment added successfully', post });

        } catch (error) {
            console.error(error);
            next(error);
        };
    }
];

export const put_add_likes = async (req: RequestWithUser, res: Response, next: NextFunction) => {

    try {
        const post = await Post.findById(req.params.id).exec();
        if (!post) return res.status(404).json({ msg: 'Post not found' });

        const userId = new Types.ObjectId(req.user._id);
        switch (true) {
            case !post.likes.length || !post.likes.some(like => like.like_user.equals(userId)):
                const newLike = new Like(userId, new Date(Date.now()));
                post.likes = [...post.likes, newLike];
                await post.save();
                break;
            case post.likes.some(like => like.like_user.equals(userId)):
                return res.status(403).json({ message: 'You have already liked this post' });
        }

        res.status(200).json({ message: 'Like added successfully', post });

    } catch (error) {
        console.error(error);
        next(error);
    }
};

