import { Socket } from 'socket.io'
import { logger } from '@utils/logger'
import User from '@models/User'
import { IMessage } from '@interfaces/message.interface'
import { IUserOnlineData } from '@interfaces/message.interface';


const onlineUsers: Map<string, IUserOnlineData> = new Map<string, IUserOnlineData>()

export const onConnection = (client: Socket) => {

    logger.info(`Client with socket ID ${client.id} has connected`)

    client.on('userOnline', async (userID: string) => {

        if (onlineUsers.has(userID)) {

            client.emit('userAlreadyOnline', 'User is already online')

        } else {

            const user = await User.findById(userID).exec();

            if (user) {

                const data: IUserOnlineData = {
                    clientID: client.id,
                    username: user.name,
                    avatar: user.avatar
                };

                onlineUsers.set(userID, data)
                client.broadcast.emit('onlineUsers', [...onlineUsers.values()])
            } else {
                client.emit('userNotFound', `User with id ${userID} not found`)
            }
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
        logger.info(`Client with socket ID ${client.id} has disconnected`);
    });

}