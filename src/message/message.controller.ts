import { NextFunction, Response } from "express";
import { MessageService } from "./message.service";
import { Controller } from "@shared/decorators/common.decorator";
import { LoggerException } from "@shared/exceptions/common.exception";
import { RequestWithUser } from "@shared/interfaces/request.interface";
import { logger } from "@utils/logger";
import { SuccessResponse } from "@utils/httpResponse";

@Controller()
export class MessageController {

    private readonly messageService: MessageService;

    constructor() {
        this.messageService = new MessageService()
    }

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