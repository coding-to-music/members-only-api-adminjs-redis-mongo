import Message from '@models/Message';
import { body, validationResult } from 'express-validator';
import { RequestWithUser } from '@interfaces/users.interface';
import { NextFunction, Response } from 'express';
import {
    NotFoundException,
    ValidationException,
} from '@exceptions/commonExceptions';
import { logger } from '@utils/logger';
import { Types } from 'mongoose';


class MessageController {

    public async getMessages(req: RequestWithUser, res: Response, next: NextFunction) {
        try {

            const { _id } = req.user

            const messages = await Message.find({ sender: _id });
            if (!messages.length) throw new NotFoundException('User has no messages');

            res.status(200).json({ status: 'success', messages });

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

    public sendMessage = [

        body('recepient').notEmpty().isMongoId().withMessage('Recipient must be a valid MongoDB ID string'),
        body('content').notEmpty().isString().trim().isLength({ min: 1 }).withMessage('Message Content must be a string with a least 1 character'),

        async (req: RequestWithUser, res: Response, next: NextFunction) => {
            try {

                const errors = validationResult(req);
                if (!errors.isEmpty()) throw new ValidationException(errors.array());

                const { _id } = req.user;
                const { recipient, content } = req.body;

                const message = new Message({
                    sender: new Types.ObjectId(_id),
                    recipient: new Types.ObjectId(recipient),
                    content
                });

                await message.save();

                res.json({
                    status: 'success',
                    message: 'message sent successfully'
                })
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
    ]
}

export default new MessageController()