import { Socket } from 'socket.io'
import { logger } from '@utils/logger'

const onlineUsers: Map<string, string> = new Map<string, string>()

export const onConnection = (client: Socket) => {

    logger.info('New WS Connection')

    client.on('online', (userID: string) => {
        onlineUsers.set(userID, client.id)
    })

    client.on('privateMessage', (anotherSocketID: string, message: string) => {
        client.to(anotherSocketID).emit('privateMessage', client.id, message)
    })

    client.on('disconnect', () => {
        logger.info('A user disconnected');
    });


}