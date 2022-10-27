import { NextFunction, Response } from 'express';
import { RequestWithUser } from '@interfaces/users.interface';
import { logger } from '@utils/logger';
import { SuccessResponse } from '@utils/lib';
import { MessageService } from '@services/message.service';
import { LoggerException } from '@exceptions/common.exception';

export class MessageController {

    private readonly messageService = new MessageService();

    public getMessages = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {

            const { _id } = req.user;

            const messages = await this.messageService.getMessages(_id)

            res.status(200).json(new SuccessResponse(200, 'All Messages', messages));

        } catch (error: any) {
            logger.error(JSON.stringify(new LoggerException(error, req)), error);
            next(error)
        }
    }

    public deleteMessage = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {

            const { id } = req.params;         // this is subject to change, decision still to be made on how input will be passed

            await this.messageService.deleteMessage(id);

            res.status(200).json(new SuccessResponse(200, 'Message Deleted'));

        } catch (error: any) {
            logger.error(JSON.stringify(new LoggerException(error, req)), error);
            next(error)
        }
    }
}