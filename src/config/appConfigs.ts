import { CorsOptions } from 'cors';

export const whitelist: string[] = [
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