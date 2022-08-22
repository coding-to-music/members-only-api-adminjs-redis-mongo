import { Socket } from 'socket.io'
import { io } from '@/index'
import { logger } from '@utils/logger'
import { IChatUserData, IMessageData, IncomingSocketData } from '@interfaces/message.interface';
import { getDisconnectedUser } from '@utils/lib';

const onlineUsers: Map<string, IChatUserData> = new Map<string, IChatUserData>();

export const onConnection = (client: Socket) => {

    logger.info(`Client with socket ID ${client.id} has connected`)

    client.on('userOnline', async (data: IncomingSocketData) => {

        try {

            const { _id, avatar, name } = data;

            if (onlineUsers.has(_id)) {

                client.emit('userAlreadyOnline', 'User is already online')

            } else {

                const userData: IChatUserData = {
                    avatar: avatar,
                    clientID: client.id,
                    userID: _id,
                    username: name
                };

                onlineUsers.set(_id, userData)
                io.emit('setOnlineUsers', [...onlineUsers.values()])

            }
        } catch (error: any) {
            logger.error('Something went wrong', error)
            client.emit('errorOccured', error.message ?? 'Something went wrong')
        }

    })

    client.on('sendPrivateMessage', (message: IMessageData) => {

        try {
            const { content, recipientID } = message;
            const recipientData = onlineUsers.get(recipientID);

            if (recipientData) {
                client.to(recipientData.clientID).emit('receivePrivateMessage', content)
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