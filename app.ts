import express, { NextFunction, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import createHttpError from 'http-errors';
import morgan from 'morgan';
import { config } from 'dotenv';
import passport from 'passport';
import cors, { CorsOptions } from 'cors'
import helmet from 'helmet';
import compression from 'compression';

import initDB from '@configs/database';
import authConfig from '@configs/passport';
import apiRouter from '@routes/api/api';
import indexRouter from '@routes/index';

config();

// Initialize DB
initDB();

// Load Paasport configuration
authConfig(passport)

const app = express();
const whitelist = ['https://localhost:3000', 'https://www.pollaroid.net', 'https://mema.azurewebsites.net', 'https://mema.polldevs.com'];
const corsOptions: CorsOptions = {
    credentials: true,
    methods: ['GET', 'DELETE', 'OPTIONS', 'POST', 'PUT'],
    origin: (requestOrigin: string | undefined, callback) => {
        if (whitelist.indexOf(requestOrigin as string) !== -1 || !requestOrigin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
};

app.use(morgan('dev'));
app.use(express.json({ limit: '16mb' }));
app.use(express.urlencoded({ limit: '16mb', extended: true }));

app.use(passport.initialize());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(cors(corsOptions));
app.use(helmet());
app.use(compression());

app.use('/', indexRouter);
app.use('/api', apiRouter);

// Handle 404 errors
app.use((req: Request, res: Response, next) => {
    next(createHttpError(404, 'The requested resource was not found on this server!!!'))
});

// Error handler
app.use((err: { status: number; message: any; toString: () => any; }, req: Request, res: Response, next: NextFunction) => {
    res.status(err.status || 500).json({ error: err.message || err.toString() })
})

export default app
