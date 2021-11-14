import { config } from 'dotenv';
import mongoose from 'mongoose';
import { env } from '@/utils/validateEnv';

const initDB = () => {
    config();

    const options = {
        autoIndex: false, // Don't build indexes
        maxPoolSize: 10, // Maintain up to 10 socket connections
        serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        family: 4, // Use IPv4, skip trying IPv6,
        ssl: true,
    };

    const mongoDB = env.DB_URL as string;
    mongoose.connect(mongoDB, options);
    const db = mongoose.connection;
    db.on('connected', () => console.log('Mongoose connected to DB cluster'));
    db.on('error', () => console.error.bind(console, 'MongoDB connection error:'));
    db.on('disconnected', () => console.log('Mongoose disconnected'));
}

export default initDB