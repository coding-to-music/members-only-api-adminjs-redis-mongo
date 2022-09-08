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
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import rateLimit from 'express-rate-limit'
import { HttpException } from '@exceptions/http.exception'
import { ENV } from '@utils/validateEnv';

// Import Configs
import { connectDB } from '@config/database';
import { corsOptions, whitelist } from '@config/appConfigs';
import passportConfig from '@middlewares/passport';
import { stream } from '@utils/logger';
// import { adminJs, adminJSRouter } from '@config/adminjs';

// Import Routes
import { ApiRouter } from '@routes/api/api.route';
import { IndexRouter } from '@routes/index.route';


export class App {

    private app: Express;

    constructor() {
        
        this.app = express();
        
        // Connect To Database
        connectDB();

        // Load Passport configuration
        passportConfig(passport);

        this.initializeMiddlewares()
        this.initializeRoutes()
        this.initializeSwaggerUI()
        this.initializeErrorHandlers()
    };

    private initializeMiddlewares() {

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
        // this.app.use(adminJs.options.rootPath, adminJSRouter);    // Currenly disabled, causing error crashing app on heroku
        this.app.use(morgan('combined', { stream }));
        this.app.use(express.json({ limit: '16mb' }));
        this.app.use(express.urlencoded({ limit: '16mb', extended: true }));

        this.app.use(passport.initialize());
        this.app.use(cookieParser(ENV.COOKIE_SECRET));
        this.app.use(cors(corsOptions));
        this.app.use(helmet());
        this.app.use(compression());
        this.app.use(apiLimiter);
    }

    private initializeRoutes() {
        this.app.use('/', new IndexRouter().getRoutes());
        this.app.use('/v1', new ApiRouter().getRoutes());
    }

    private initializeSwaggerUI() {
        // Swagger UI
        const favicon = readFileSync('./src/docs/favicon.ico', { encoding: 'base64' });
        const swaggerUiOptions = {
            customCss: '.swagger-ui .topbar { display: none }',
            customSiteTitle: 'Members-Only API Docs',
            customfavIcon: favicon,
        };

        const swaggerDocument = YAML.load('./src/docs/swaggerConfig.yaml');
        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerUiOptions));
    }

    private initializeErrorHandlers() {
        // Handle 404 errors
        this.app.use((req: Request, res: Response, next: NextFunction) => {
            next(createHttpError(404, 'The requested resource was not found on this server!!!'));
        });

        // Error handler
        this.app.use((error: HttpException, req: Request, res: Response, next: NextFunction) => {
            res.status(error.statusCode ?? 500).json(error);
        })
    }

    public getApp() {
        return this.app
    }
}