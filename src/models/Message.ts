import { Schema, model } from 'mongoose';
import { IMessage } from '@src/interfaces/message.interface'

const MessageSchema = new Schema<IMessage>({
    sender: { type: 'ObjectId', ref: 'User' },
    recipient: { type: 'ObjectId', ref: 'User' },
    content: { type: String, required: true, minlength: 1 },
}, { timestamps: true });

export default model<IMessage>('Message', MessageSchema);