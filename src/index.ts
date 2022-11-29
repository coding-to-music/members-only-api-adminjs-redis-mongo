import http from 'http';
import { Server } from 'socket.io';
import { App } from '@/app';
import { corsOptions } from '@config/appConfigs';
import { logger } from '@utils/logger';
import { onConnection } from './config/socketio';
import { connectDB } from '@config/database';
import { connectRedis } from './config/cache';

const PORT = process.env.PORT || 4002;

const httpServer = http.createServer(new App().getApp());

export const io = new Server(httpServer, {
  path: '/v1/messaging',
  pingTimeout: 30000,
  cors: corsOptions
})

io.on('connection', onConnection);

httpServer.listen(PORT, async () => {
  await connectDB()
  await connectRedis()
  logger.info(`Server Started on port: ${PORT}`)
})

httpServer.on('error', (error: NodeJS.ErrnoException) => {

  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof PORT === 'string'
    ? 'Pipe ' + PORT
    : 'Port ' + PORT;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
    default:
      throw error;
  }
});