import Message from '@models/Message';
import { RequestWithUser } from '@interfaces/users.interface';
import { NextFunction, Response } from 'express';
import { logger } from '@utils/logger';

class MessageController {

    public async getMessages(req: RequestWithUser, res: Response, next: NextFunction) {
        try {

            const { _id } = req.user;

            const fromUser = (await Message.find({ sender: _id }))
                .map(message => { return { content: message.content, recipientID: message.recipientID } });
            const toUser = (await Message.find({ recipient: _id }))
                .map(message => { return { content: message.content, senderID: message.senderID } });

            const messages = { fromUser, toUser };

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

            const { _id } = req.params;         // this is subject to change, decision still to be made on how input will be passed
            await Message.deleteOne({ _id })

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

export default new MessageController()