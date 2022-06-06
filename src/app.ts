import express, { NextFunction, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import createHttpError from 'http-errors';
import { readFileSync } from 'fs';
import morgan from 'morgan';
import { config } from 'dotenv';
import passport from 'passport';
import cors, { CorsOptions } from 'cors'
import helmet from 'helmet';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import rateLimit from 'express-rate-limit'

// Import Configs
import initDB from '@configs/database';
import passportConfig from '@middlewares/passport';

// Import Routes
import apiRouter from '@routes/api/api';
import indexRouter from '@routes/index';

config();

// Initialize DB
initDB();

// Load Paasport configuration
passportConfig(passport);

const app = express();
const whitelist = ['https://localhost:3000', 'https://www.pollaroid.net', 'https://api-mbo.herokuapp.com'];
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

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests, please try again later.',
    skipSuccessfulRequests: true,
    skip: (req, res) => whitelist.includes(req.headers.origin as string)
})

app.use(morgan('dev'));
app.use(express.json({ limit: '16mb' }));
app.use(express.urlencoded({ limit: '16mb', extended: true }));

app.use(passport.initialize());
app.use(cookieParser(process.env['COOKIE_SECRET']));
app.use(cors(corsOptions));
app.use(helmet());
app.use(compression());
app.use(apiLimiter);

app.use('/', indexRouter);
app.use('/v1', apiRouter);

// Swagger UI
const favicon = readFileSync('./src/docs/favicon.ico', { encoding: 'base64' });
const swaggerUiOptions = {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Members-Only API Docs',
    customfavIcon: favicon,
};

const swaggerDocument = YAML.load('./src/docs/swaggerConfig.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerUiOptions));

// Handle 404 errors
app.use((req: Request, res: Response, next) => {
    next(createHttpError(404, 'The requested resource was not found on this server!!!'));
});

// Error handler
app.use((err: { status: number; message: any; toString: () => any; }, req: Request, res: Response, next: NextFunction) => {
    res.status(err.status || 500).json({ error: err.message || err.toString() });
})

export default app;