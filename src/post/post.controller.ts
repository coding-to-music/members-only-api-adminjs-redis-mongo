import { NextFunction, Response } from "express";
import { PostService } from "./post.service";
import { Controller } from "@shared/decorators/common.decorator";
import { RequestWithUser } from "@shared/interfaces/request.interface";
import { LoggerException } from "@shared/exceptions/common.exception";
import { SuccessResponse } from "@utils/httpResponse";
import { logger } from "@utils/logger"

@Controller()
export class PostController {

    private readonly postService: PostService;

    constructor() {
        this.postService = new PostService()
    }

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

    public addComments = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {

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

    public likePost = async (req: RequestWithUser, res: Response, next: NextFunction) => {
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

    public unlikePost = async (req: RequestWithUser, res: Response, next: NextFunction) => {
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