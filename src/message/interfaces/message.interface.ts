import { Document, Types } from "mongoose";

export interface IMessage extends Document {
    content: string,
    senderID: Types.ObjectId;
    recipientID: Types.ObjectId;
}

export interface IChatUserData {
    clientID: string,
    userID: string,
    username: string,
    avatar: string
}

export interface IncomingSocketData {
    _id: string,
    name: string,
    avatar: string
}

export type IMessageData = Pick<IMessage, 'content' | 'senderID' | 'recipientID'>