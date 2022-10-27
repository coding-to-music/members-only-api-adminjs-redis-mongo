import { NextFunction, Request, Response } from 'express';
import { param } from 'express-validator';
import { checkValidations } from '@utils/checkValidations';


export class AdminRequestValidator {

    public idValidator = [

        param('id').notEmpty().isMongoId().trim().escape(),

        async (req: Request, res: Response, next: NextFunction) => {
            checkValidations(req, res, next)
        }
    ];
}