import { Socket } from 'socket.io'
import { logger } from '@utils/logger'
import { IMessage } from '@interfaces/message.interface'
import { IUserOnlineData, IncomingSocketData } from '@interfaces/message.interface';
import { getDisconnectedUser } from '@utils/lib';

const onlineUsers: Map<string, IUserOnlineData> = new Map<string, IUserOnlineData>()

export const onConnection = (client: Socket) => {

    logger.info(`Client with socket ID ${client.id} has connected`)

    client.on('userOnline', async (data: IncomingSocketData) => {

        try {

            const { _id, avatar, name } = data;

            if (onlineUsers.has(_id)) {

                client.emit('userAlreadyOnline', 'User is already online')

            } else {

                const userData: IUserOnlineData = {
                    clientID: client.id,
                    username: name,
                    avatar: avatar
                };

                onlineUsers.set(_id, userData)
                client.broadcast.emit('onlineUsers', [...onlineUsers.values()])

            }
        } catch (error) {
            console.log(error)
        }

    })

    client.on('sendPrivateMessage', (message: IMessage) => {

        const { recipient, content } = message;
        const recipientData = onlineUsers.get(String(recipient));

        if (recipientData) {
            client.to(recipientData.clientID).emit('receivePrivateMessage', content)
        } else {
            client.emit('recipientOffline', `Recipient with userID ${recipient} is currently offline`)
        }

    });

    client.on('userOffline', (userID: string) => {

        if (onlineUsers.has(userID)) {

            onlineUsers.delete(userID);
            client.broadcast.emit('onlineUsers', [...onlineUsers.values()]);
            logger.info(`User with ID ${userID} is offline`);

        } else {
            client.emit('userNotOnline', 'Cannot set user offline, User not currently online')
        }

    });

    client.on('disconnect', () => {

        const disconnectedUser = getDisconnectedUser(onlineUsers, client.id)

        if (disconnectedUser) {

            onlineUsers.delete(disconnectedUser);
            client.broadcast.emit('onlineUsers', [...onlineUsers.values()]);
            logger.info(`Client with socket ID ${client.id} has disconnected`);
            
        } else {
            logger.info(`Client with socket ID ${client.id} has disconnected`);
        }

    });

}