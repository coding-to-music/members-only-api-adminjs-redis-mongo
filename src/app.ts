import express, {
    Express,
    NextFunction,
    Request,
    Response
} from 'express';
import cookieParser from 'cookie-parser';
import createHttpError from 'http-errors';
import { readFileSync } from 'fs';
import morgan from 'morgan';
import passport from 'passport';
import cors, { CorsOptions } from 'cors'
import helmet from 'helmet';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import rateLimit from 'express-rate-limit'
import { HttpException } from '@exceptions/http.exception'
import { ENV } from '@utils/validateEnv';

// Import Configs
import { connectDB } from '@config/database';
import passportConfig from '@middlewares/passport';
import { stream } from '@utils/logger';

// Import Routes
import { ApiRouter } from '@routes/api/api.route';
import { IndexRouter } from '@routes/index.route';

// Connect To Database
connectDB();

// Load Passport configuration
passportConfig(passport);

const app: Express = express();

const whitelist: string[] = [
    'https://localhost:3000',
    'http://localhost:3000',
    'https://api-mbo.herokuapp.com',
    'https://api-mbo.polldevs.com',
    'http://api-mbo.polldevs.com',
    'https://mema.polldevs.com'
];

export const corsOptions: CorsOptions = {
    credentials: true,
    methods: ['GET', 'DELETE', 'OPTIONS', 'POST', 'PUT', 'PATCH'],
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

// AdminJS moved to the top to fix cors and bodyParser issues
// import { adminJs, adminJSRouter } from '@config/adminjs';
// app.use(adminJs.options.rootPath, adminJSRouter);    // Currenly disabled, causing error crashing app on heroku
app.use(morgan('combined', { stream }));
app.use(express.json({ limit: '16mb' }));
app.use(express.urlencoded({ limit: '16mb', extended: true }));

app.use(passport.initialize());
app.use(cookieParser(ENV.COOKIE_SECRET));
app.use(cors(corsOptions));
app.use(helmet());
app.use(compression());
app.use(apiLimiter);

app.use('/', new IndexRouter().getRoutes());
app.use('/v1', new ApiRouter().getRoutes());

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
app.use((req: Request, res: Response, next: NextFunction) => {
    next(createHttpError(404, 'The requested resource was not found on this server!!!'));
});

// Error handler
app.use((error: HttpException, req: Request, res: Response, next: NextFunction) => {
    res.status(error.statusCode ?? 500).json(error);
})

export default app;