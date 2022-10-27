import { NextFunction, Response, Request } from 'express';
import { body, validationResult } from 'express-validator';
import { RequestWithUser } from '@interfaces/users.interface';
import { formatPostCommentsAndLikes, SuccessResponse } from '@utils/lib';
import { LoggerException, ValidationException } from '@exceptions/common.exception';
import { logger } from '@utils/logger'
import { PostService } from '@services/post.service';


export class PostController {

    private readonly postService = new PostService()

    public getAllPosts = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {

            const data = await this.postService.getAllPosts();

            res.status(200).json(new SuccessResponse(200, 'All Posts', data));

        } catch (error: any) {
            logger.error(JSON.stringify(new LoggerException(error, req)), error);
            next(error)
        }
    };

    public getPostsByUser = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {

            const { _id } = req.user;

            const data = await this.postService.getPostsByUser(_id)

            res.status(200).json(new SuccessResponse(200, 'Post Details', data));

        } catch (error: any) {
            logger.error(JSON.stringify(new LoggerException(error, req)), error);
            next(error)
        }
    };

    public getPostById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;

            const data = await this.postService.getPostById(id)

            res.status(200).json(new SuccessResponse(200, 'Post Details', data));

        } catch (error: any) {
            logger.error(JSON.stringify(new LoggerException(error, req)), error);
            next(error)
        }
    };

    public createPost = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {

            const { _id } = req.user;

            const { postContent, postTitle } = req.body

            const data = await this.postService.createPost(_id, postContent, postTitle)

            res.status(201).json(new SuccessResponse(201, 'Post Created', data));

        } catch (error: any) {
            logger.error(JSON.stringify(new LoggerException(error, req)), error);
            next(error)
        }
    }

    public putAddComments = [

        body('comment').not().isEmpty().withMessage('Comment cannot be empty'),

        async (req: RequestWithUser, res: Response, next: NextFunction) => {

            try {

                const errors = validationResult(req);

                if (!errors.isEmpty()) throw new ValidationException(errors.array());

                const { id: postID } = req.params
                const { _id: userID } = req.user;
                const { comment } = req.body

                const data = await this.postService.addComments(postID, userID, comment)

                res.status(201).json(new SuccessResponse(200, 'Comment Added', data));

            } catch (error: any) {
                logger.error(JSON.stringify(new LoggerException(error, req)), error);
                next(error)
            }
        }
    ];

    public deleteComment = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {

            const { id: postID, commentId } = req.params;

            const { _id: userID } = req.user;

            const data = await this.postService.deleteComment(postID, userID, commentId)

            res.status(200).json(new SuccessResponse(200, 'Comment Deleted', data));

        } catch (error: any) {
            logger.error(JSON.stringify(new LoggerException(error, req)), error);
            next(error)
        }
    };

    public putLikePost = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {

            const { id: postID } = req.params;

            const { _id: userID } = req.user;

            const data = await this.postService.likePost(postID, userID)

            res.status(200).json(new SuccessResponse(200, 'Post Liked', data));

        } catch (error: any) {
            logger.error(JSON.stringify(new LoggerException(error, req)), error);
            next(error)
        }
    };

    public deleteUnlikePost = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {

            const { id: postID } = req.params;

            const { _id: userID } = req.user;

            const data = await this.postService.unLikePost(postID, userID)

            res.status(200).json(new SuccessResponse(200, 'Post Unliked', data));

        } catch (error: any) {
            logger.error(JSON.stringify(new LoggerException(error, req)), error);
            next(error)
        }
    };

    public deletePost = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {

            const { id: postID } = req.params;

            const { _id: userID } = req.user;

            await this.postService.deletePost(postID, userID)

            res.status(200).json(new SuccessResponse(200, 'Post Deleted'));

        } catch (error: any) {
            logger.error(JSON.stringify(new LoggerException(error, req)), error);
            next(error)
        }
    }
};