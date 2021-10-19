import express from 'express';
import cookieParser from 'cookie-parser';
import createHttpError from 'http-errors';
import morgan from 'morgan';
import { config } from 'dotenv';
import passport from 'passport';
import cors from 'cors'
import helmet from 'helmet';
import compression from 'compression';


import initDB from './config/database.mjs';
import authConfig from './config/passport.mjs';
import apiRouter from './routes/api/api.mjs';
import indexRouter from './routes/index.mjs';

config();

// Initialize DB
initDB();

// Load Paasport configuration
authConfig(passport)

const app = express();

app.use(morgan('dev'));
app.use(express.json({ limit: '16mb' }));
app.use(express.urlencoded({ limit: '16mb', extended: true }));

app.use(passport.initialize());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(cors());
app.use(helmet());
app.use(compression());

app.use('/', indexRouter);
app.use('/api', apiRouter);

// Handle 404 errors
app.use((req, res, next) => {
    next(createHttpError(404, 'The requested resource was not found on this server!!!'))
});

// Error handler
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ error: err.message || err.toString() })
})

export default app
