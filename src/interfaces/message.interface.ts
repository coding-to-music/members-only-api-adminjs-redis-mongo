import { Document, Types } from 'mongoose';

export interface IMessage extends Document {
    sender: Types.ObjectId;
    recipient: Types.ObjectId;
    content: string
}

export interface IOnlineUserData {
    clientID: string,
    username: string,
    avatar: string
}