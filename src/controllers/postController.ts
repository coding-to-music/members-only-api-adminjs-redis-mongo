import Post from '@models/Post';
import { body, validationResult } from 'express-validator';
import { Response, NextFunction, Request } from 'express';
import { RequestWithUser } from '@interfaces/users.interface';
import { formatPostCommentsAndLikes, checkIfPostExists } from '@utils/lib';
import { Comment, Like } from '@interfaces/posts.interface';
import { Types } from 'mongoose';
import { IPost } from '@interfaces/posts.interface';
import { getCacheKey, setCacheKey } from '@config/cache';
import {
    ConflictException,
    ForbiddenException,
    NotFoundException,
    ValidationBodyException,
} from '@exceptions/commonExceptions';
import { logger } from '@utils/logger'

class PostController {

    public async getAllPosts(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            const value = await getCacheKey('all_posts')
            if (value) return res.status(200).json({ fromCache: true, data: JSON.parse(value) });
            const posts = await Post.find({}).exec();
            await setCacheKey('all_posts', posts);
            res.status(200).json({ fromCache: false, data: posts });
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
    };

    public async getPostsByUser(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            const { _id } = req.user;

            // Check cache for matching key
            const value = await getCacheKey(`posts/${_id}`);
            if (value) return res.status(200).json({ fromCache: true, data: JSON.parse(value) });

            // If value doesn't exist, load from DB and set new cache key
            const posts = await Post.find({ user: _id }).exec();
            if (!posts.length) throw new NotFoundException('User has no posts');
            await setCacheKey(`posts/${_id}`, posts);

            res.status(200).json({ fromCache: false, data: posts });
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

    public async getPostById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            // Check cache for matching key
            const value = await getCacheKey(`posts/${id}`)
            if (value) return res.status(200).json({ fromCache: true, data: JSON.parse(value) });

            // If value doesn't exist, load from DB and set new cache key
            const post = await checkIfPostExists(req, res, next);
            await setCacheKey(`posts/${id}`, post);

            res.status(200).json({ fromCache: false, data: post });
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
    };

    public postCreatePost = [

        (req: Request, res: Response, next: NextFunction) => formatPostCommentsAndLikes(req, res, next),

        body('postTitle').not().isEmpty().withMessage('Post Title cannot be empty').isLength({ min: 3, max: 30 }).withMessage('Post Title be between 3 to 30 characters '),
        body('postContent').not().isEmpty().withMessage('Post content cannot be empty').isLength({ min: 10 }).withMessage('Post Content must contain at least 10 characters'),

        async (req: RequestWithUser, res: Response, next: NextFunction) => {

            try {

                const errors = validationResult(req);
                if (!errors.isEmpty()) throw new ValidationBodyException(errors.array());

                const { _id } = req.user;
                const { postContent, postTitle } = req.body

                // Check if the user has an existing post with the same title
                const isPostExists = await Post.find({ user: _id, postTitle })
                if (isPostExists) throw new ConflictException('User has an existing post with the same title');

                const post = new Post({
                    user: new Types.ObjectId(_id),
                    postTitle,
                    postContent
                });
                await post.save();
                res.status(201).json({
                    message: 'Post created successfully',
                    post
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
    ];

    public putAddComments = [

        body('comment').not().isEmpty().withMessage('Comment cannot be empty'),

        async (req: RequestWithUser, res: Response, next: NextFunction) => {

            try {

                const errors = validationResult(req);
                if (!errors.isEmpty()) throw new ValidationBodyException(errors.array());

                const post = await checkIfPostExists(req, res, next) as IPost;

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

            } catch (err: any) {
                logger.error(`
                ${err.statusCode || 500} - 
                ${err.error || 'Something Went Wrong'} - 
                ${req.originalUrl} - 
                ${req.method} - 
                ${req.ip}
                `);
                next(err);
            };
        }
    ];

    public async deleteComment(req: RequestWithUser, res: Response, next: NextFunction) {
        try {

            const post = await checkIfPostExists(req, res, next) as IPost;

            const commentIndex: number = post.comments.findIndex(comment => comment.comment_user.equals(new Types.ObjectId(req.user._id)));
            if (commentIndex === -1) throw new NotFoundException('User has not commented on this post');

            const commentIndexInCommentList: number = post.comments[commentIndex].comment_list.findIndex(comment => comment._id!.equals(new Types.ObjectId(req.params.commentId)));
            if (commentIndexInCommentList === -1) return res.status(404).json({ msg: 'Comment not found' });

            post.comments[commentIndex].comment_list.splice(commentIndexInCommentList, 1);
            await post.save();

            res.status(200).json({ message: 'Comment deleted successfully', post });

        } catch (err: any) {

            logger.error(`
                ${err.statusCode || 500} - 
                ${err.error || 'Something Went Wrong'} - 
                ${req.originalUrl} - 
                ${req.method} - 
                ${req.ip}
                `);
            next(err);
        };
    };

    public async putLikePost(req: RequestWithUser, res: Response, next: NextFunction) {

        try {
            const post = await checkIfPostExists(req, res, next) as IPost;

            const userId = new Types.ObjectId(req.user._id);

            switch (true) {
                case !post.likes.length || !post.likes.some(like => like.like_user.equals(userId)):
                    const newLike = new Like(userId, new Date(Date.now()));
                    post.likes = [...post.likes, newLike];
                    await post.save();
                    break;
                case post.likes.some(like => like.like_user.equals(userId)):
                    throw new ForbiddenException('You have already liked this post')
            }

            res.status(200).json({ message: 'Like added successfully', post });

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
    };

    public async deleteUnlikePost(req: RequestWithUser, res: Response, next: NextFunction) {
        try {

            const post = await checkIfPostExists(req, res, next) as IPost;

            const likeIndex: number = post.likes.findIndex(like => like.like_user.equals(new Types.ObjectId(req.user._id)));
            if (likeIndex === -1) throw new NotFoundException('User has not liked this post')

            post.likes.splice(likeIndex, 1);
            await post.save();

            res.status(200).json({ message: 'Like deleted successfully', post });

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
    };

    public async deletePost(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            const post = await checkIfPostExists(req, res, next) as IPost;

            if (!post.user.equals(new Types.ObjectId(req.user._id)))
                throw new ForbiddenException('You cannot delete this post');

            await post.remove();
            res.status(200).json({ message: 'Post deleted successfully' });

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
}

export default new PostController()