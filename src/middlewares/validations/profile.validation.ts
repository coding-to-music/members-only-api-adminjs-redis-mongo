import { NextFunction, Request, Response } from 'express';
import { body } from 'express-validator';
import { formatProifleBody} from '@utils/lib';
import { checkValidations } from '@utils/checkValidations';
import { RequestWithUser } from '@interfaces/users.interface';


export class ProfileRequestValidator {

    public createProfileValidator = [

        (req: RequestWithUser, res: Response, next: NextFunction) => formatProifleBody(req, res, next),

        body('bio').not().isEmpty().withMessage('Bio cannot be empty').trim().escape(),
        body('address').not().isEmpty().withMessage('Address cannot be empty').trim().escape(),
        body('phoneNumber').not().isEmpty().withMessage('Phone number cannot be empty'),

        // Handle validation for array of objects
        body('education').isArray({ min: 1 }).withMessage('Education must be an array'),
        body('education[*].*').trim().isLength({ min: 1 }).escape(),
        body('experience').isArray({ min: 1 }).withMessage('Experience must be an array'),
        body('experience[*].*').trim().isLength({ min: 1 }).escape(),

        body('social').not().isEmpty().withMessage('Social cannot be empty'),
        body('social.github').not().isEmpty().withMessage('Github cannot be empty'),
        body('social.linkedin').not().isEmpty().withMessage('Linkedin cannot be empty'),
        body('social.twitter').not().isEmpty().withMessage('Twitter cannot be empty'),

        async (req: Request, res: Response, next: NextFunction) => {
            checkValidations(req, res, next)
        }
    ];
}