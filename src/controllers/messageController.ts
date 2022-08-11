import Message from '@models/Message';
import { body, validationResult } from 'express-validator';
import {
    ForbiddenException,
    NotFoundException,
    UnAuthorizedException,
    ValidationException,
} from '@exceptions/commonExceptions';
import { logger } from '@utils/logger';

class MessageController {

    public getMessages = [

        body('recepient').notEmpty().isMongoId().withMessage('Recipient must be a valid MongoDB ID string')
    ];

    public sendMessage = [

        body('recepient').notEmpty().isMongoId().withMessage('Recipient must be a valid MongoDB ID string'),
        body('content').notEmpty().isString().trim().isLength({ min: 1 }).withMessage('Message Content must be a string with a least 1 character')
    ]
}

export default new MessageController()