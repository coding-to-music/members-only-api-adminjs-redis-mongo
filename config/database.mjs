import { config } from 'dotenv';
import mongoose from 'mongoose';

const initDB = () => {
    config();
    const mongoDB = process.env.DB_URL
    mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = mongoose.connection;
    db.on('connected', () => console.log('Mongoose connected to DB cluster'));
    db.on('error', () => console.error.bind(console, 'MongoDB connection error:'));
    db.on('disconnected', () => console.log('Mongoose disconnected'));
}

export default initDB