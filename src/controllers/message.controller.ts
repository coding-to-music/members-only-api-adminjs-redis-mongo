import { NextFunction, Response } from 'express';
import Message from '@models/Message';
import { RequestWithUser } from '@interfaces/users.interface';
import { logger } from '@utils/logger';

export class MessageController {

    public async getMessages(req: RequestWithUser, res: Response, next: NextFunction) {
        try {

            const { _id } = req.user;

            const toOthers = (await Message.find({ senderID: _id }))
                .map(mes => { return { content: mes.content, recipientID: mes.recipientID } });
            const fromOthers = (await Message.find({ recipientID: _id }))
                .map(mes => { return { content: mes.content, senderID: mes.senderID } });

            const messages = { toOthers, fromOthers };

            res.status(200).json({ status: 'success', messages });

        } catch (err: any) {
            logger.error(`
                ${err.statusCode ?? 500} - 
                ${err.error ?? 'Something Went Wrong'} - 
                ${req.originalUrl} - 
                ${req.method} - 
                ${req.ip}
                `);
            next(err);
        }
    }

    public async deleteMessage(req: RequestWithUser, res: Response, next: NextFunction) {
        try {

            const { id } = req.params;         // this is subject to change, decision still to be made on how input will be passed
            await Message.deleteOne({ id })

            res.status(200).json({
                status: 'success',
                message: 'Message deleted successfully'
            });

        } catch (err: any) {
            logger.error(`
                ${err.statusCode ?? 500} - 
                ${err.error ?? 'Something Went Wrong'} - 
                ${req.originalUrl} - 
                ${req.method} - 
                ${req.ip}
                `);
            next(err);
        }
    }
}