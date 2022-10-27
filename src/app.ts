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
import { HttpException } from '@exceptions/http.exception'
import { ENV } from '@utils/validateEnv';

// Import Configs
import { connectDB } from '@config/database';
import { corsOptions, apiLimiter } from '@config/appConfigs';
import passportConfig from '@middlewares/passport';
import { stream } from '@utils/logger';
import { adminJs, adminJSRouter } from '@config/adminjs';

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

        // AdminJS moved to the top to fix cors and bodyParser issues
        this.app
        .use(adminJs.options.rootPath, adminJSRouter)
        .use(morgan('combined', { stream }))
        .use(express.json({ limit: '16mb' }))
        .use(express.urlencoded({ limit: '16mb', extended: true }))
        .use(passport.initialize())
        .use(cookieParser(ENV.COOKIE_SECRET))
        .use(cors(corsOptions))
        .use(helmet())
        .use(compression())
        .use(apiLimiter)
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

        const swaggerDocument = YAML.load('./src/docs/swaggerConfig.yml');
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