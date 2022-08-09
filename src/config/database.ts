import { connect, connection } from 'mongoose';
import { ENV } from '@utils/validateEnv';
import { logger } from '@utils/logger';

const initDB = () => {

    const options = {
        autoIndex: false, // Don't build indexes
        maxPoolSize: 10, // Maintain up to 10 socket connections
        serverSelectionTimeoutMS: 10000, // Keep trying to send operations for 5 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        family: 4, // Use IPv4, skip trying IPv6,
        ssl: true,
    };

    const mongoDB = ENV.DB_URL;
    connect(mongoDB, options);
    connection.on('connected', () => logger.info('Mongoose connected to DB cluster'));
    connection.on('error', () => logger.error('MongoDB connection error:'));
    connection.on('disconnected', () => logger.info('Mongoose disconnected'));
}

export default initDB