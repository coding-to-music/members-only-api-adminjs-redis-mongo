import { NextFunction, Request, Response } from "express";
import { param } from "express-validator";
import { checkValidations } from "@utils/checkValidations";


export class MediaRequestValidator {

    public fileNameValidator = [

        param('filename', 'File name is required').notEmpty().trim().escape(),

        async (req: Request, res: Response, next: NextFunction) => {
            checkValidations(req, res, next)
        }
    ];
}