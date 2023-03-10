import { Socket } from "socket.io"
import { Types } from "mongoose"
import { ioInstance } from "@/index"
import { Message } from "@message/models/message.model"
import { IChatUserData, IMessageData, IncomingSocketData } from "@message/interfaces/message.interface";
import { getDisconnectedUser } from "@utils/lib";
import { logger } from "@utils/logger"

const onlineUsers: Map<string, IChatUserData> = new Map<string, IChatUserData>();

export const onConnection = (client: Socket) => {

    logger.info(`Client with socket ID ${client.id} has connected`)

    client.on('userOnline', async (data: IncomingSocketData) => {

        try {

            const { _id, avatar, name } = data;

            if (onlineUsers.has(_id)) {

                client.emit('userAlreadyOnline', 'User is already online')

            } else if (_id && avatar && name) {

                const userData: IChatUserData = {
                    avatar: avatar,
                    clientID: client.id,
                    userID: _id,
                    username: name
                };

                onlineUsers.set(_id, userData)
                ioInstance.emit('setOnlineUsers', [...onlineUsers.values()])

            } else {
                client.emit('errorOccured', 'Something went wrong')
            }
        } catch (error: any) {
            logger.error('Something went wrong', error)
            client.emit('errorOccured', error.message ?? 'Something went wrong')
        }

    })

    client.on('sendPrivateMessage', async (message: IMessageData) => {

        try {
            const { content, senderID, recipientID } = message;
            const recipientData = onlineUsers.get(String(recipientID));

            const messageToSave = new Message({
                content,
                senderID: new Types.ObjectId(senderID),
                recipientID: new Types.ObjectId(recipientID),
            });

            await messageToSave.save();

            if (recipientData) {
                client.to(recipientData.clientID).emit('receivePrivateMessage', { content, senderID });
            } else {
                client.emit('recipientOffline', `Recipient with userID ${recipientID} is currently offline`)
            }
        } catch (error: any) {
            logger.error('Something went wrong', error)
            client.emit('errorOccured', error.message ?? 'Something went wrong')
        }

    });

    client.on('userOffline', (userID: string) => {

        try {
            if (onlineUsers.has(userID)) {

                onlineUsers.delete(userID);
                client.broadcast.emit('setOnlineUsers', [...onlineUsers.values()]);
                logger.info(`User with ID ${userID} is offline`);

            } else {
                client.emit('userNotOnline', 'Cannot set user offline, user not currently online')
            }
        } catch (error: any) {
            logger.error('Something went wrong', error)
            client.emit('errorOccured', error.message ?? 'Something went wrong')
        }

    });

    client.on('disconnect', () => {

        try {

            const foundKey = getDisconnectedUser(onlineUsers, client.id)

            if (foundKey) {

                onlineUsers.delete(foundKey);
                client.broadcast.emit('setOnlineUsers', [...onlineUsers.values()]);
                logger.info(`Client with socket ID ${client.id} has disconnected`);

            } else {
                logger.info(`Client with socket ID ${client.id} has disconnected`);
            }
        } catch (error: any) {
            logger.error('Something went wrong', error)
            client.emit('errorOccured', error.message ?? 'Something went wrong')
        }

    });

}