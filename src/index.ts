import http from 'http';
import { Server } from 'socket.io'
import app, { corsOptions } from '@/app';
import { logger } from '@utils/logger';
import { onConnection } from '@config/socketio';


const PORT = process.env.PORT || 3000;

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  path: '/v1/messaging',
  pingTimeout: 30000,
  cors: corsOptions
})

io.on('connection', onConnection)

httpServer.listen(PORT, () => {
  logger.info(`Server Started on port: ${PORT}`)
});

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