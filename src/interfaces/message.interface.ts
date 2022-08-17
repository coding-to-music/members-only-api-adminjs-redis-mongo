import { Document, Types } from 'mongoose';

export interface IMessage extends Document {
    sender: Types.ObjectId;
    recipient: Types.ObjectId;
    content: string
}

export interface IUserOnlineData {
    clientID: string,
    username: string,
    avatar: string
}

export interface IncomingSocketData {
    _id: string,
    name: string,
    avatar: string
}