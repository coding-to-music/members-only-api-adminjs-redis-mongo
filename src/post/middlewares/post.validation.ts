import { NextFunction, Request, Response } from "express";
import { body, param } from "express-validator";
import { formatPostCommentsAndLikes } from "@utils/lib";
import { checkValidations } from "@utils/checkValidations";


export class PostRequestValidator {

    public createPostValidator = [

        (req: Request, res: Response, next: NextFunction) => formatPostCommentsAndLikes(req, res, next),

        body('postTitle').not().isEmpty().withMessage('Post Title cannot be empty').isLength({ min: 3, max: 30 }).withMessage('Post Title be between 3 to 30 characters '),

        body('postContent').not().isEmpty().withMessage('Post content cannot be empty').isLength({ min: 10 }).withMessage('Post Content must contain at least 10 characters'),

        async (req: Request, res: Response, next: NextFunction) => {
            checkValidations(req, res, next)
        }
    ];

    public addCommentValidator = [

        body('comment').not().isEmpty().withMessage('Comment cannot be empty'),

        param('id').notEmpty().isMongoId().trim().escape(),

        async (req: Request, res: Response, next: NextFunction) => {
            checkValidations(req, res, next)
        }
    ]

    public idValidator = [

        param('id').notEmpty().isMongoId().trim().escape(),

        async (req: Request, res: Response, next: NextFunction) => {
            checkValidations(req, res, next)
        }
    ];

    public deleteCommentValidator = [

        param('id').notEmpty().isMongoId().trim().escape(),

        param('commentId').notEmpty().isMongoId().trim().escape(),

        async (req: Request, res: Response, next: NextFunction) => {
            checkValidations(req, res, next)
        }
    ];
}