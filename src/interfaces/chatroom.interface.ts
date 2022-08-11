import { Document, Types } from 'mongoose';

export interface IChatRoom extends Document {
    sender: Types.ObjectId;
    content: string,
}