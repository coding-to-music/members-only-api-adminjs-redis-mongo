import { Socket } from 'socket.io'
import { logger } from '@utils/logger'
import { IMessage } from '@interfaces/message.interface'

const onlineUsers: Map<string, string> = new Map<string, string>()

export const onConnection = (client: Socket) => {

    logger.info(`Client with socket ID ${client.id} has connected`)

    client.on('user-online', (userID: string) => {

        if (!onlineUsers.has(userID)) {
            onlineUsers.set(userID, client.id)
        } else {
            client.emit('user-already-online', 'User is already on-line')
        }

    })

    client.on('send-private-message', (message: IMessage) => {

        const { recipient, content } = message;
        const recipientSocketID = onlineUsers.get(String(recipient));

        if (recipientSocketID) {
            client.to(recipientSocketID).emit('receive-private-message', content)
        } else {
            client.emit('recipient-offline', `Recipient with userID ${recipient} is currently offline`)
        }

    });

    client.on('user-offline', (userID: string) => {

        if (onlineUsers.has(userID)) {
            onlineUsers.delete(userID)
            logger.info(`User with ID ${userID} is offline`)
        } else {
            client.emit('user-not-online', 'Cannot set oser offline, User not currently online')
        }

    });

    client.on('disconnect', () => {
        logger.info(`Client with socket ID ${client.id} has disconnected`);
    });

}