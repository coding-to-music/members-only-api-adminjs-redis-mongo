import Message from '@models/Message'


export class MessageService {

    public async getMessages(_id: string) {

        const toOthers = (await Message.find({ senderID: _id }))
            .map(mes => { return { content: mes.content, recipientID: mes.recipientID } });
        const fromOthers = (await Message.find({ recipientID: _id }))
            .map(mes => { return { content: mes.content, senderID: mes.senderID } });

        return { toOthers, fromOthers };
    };

    public async deleteMessage(id: string) {

        await Message.deleteOne({ id })

    }
}