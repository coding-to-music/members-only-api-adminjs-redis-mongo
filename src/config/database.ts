import { connect, connection, mongo } from 'mongoose';
import { ENV } from '@utils/validateEnv';
import { GridFSBucket } from 'mongoose/node_modules/mongodb';

let bucket: GridFSBucket;

export const connectDB = () => {

    const options = {
        autoIndex: false,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        family: 4,
        ssl: true,
    };

    connect(ENV.DB_URL, options);

    connection.on('connected', () => console.log('Mongoose connected to DB cluster'));
    connection.on('error', () => console.error('MongoDB connection error:'));
    connection.on('disconnected', () => console.info('Mongoose disconnected'));

    connection.once('open', () => {
        bucket = new mongo.GridFSBucket(connection.db, {
            bucketName: 'uploads'
        });
    });

};

export const getBucket = () => {
    return bucket;
};