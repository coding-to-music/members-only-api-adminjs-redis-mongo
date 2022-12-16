import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { Logtail } from '@logtail/node'
import { LogtailTransport } from '@logtail/winston'
import { ENV } from '@utils/loadEnv';

const { align, combine, colorize, printf, timestamp, errors } = format;

const logtail = new Logtail(ENV.LOGTAIL_SOURCE_TOKEN)

const logger = createLogger({
    level: 'http',      // Logs anything from info level and above
    format: combine(
        colorize({ all: true }),
        errors({ stack: true }),
        timestamp({ format: 'YYYY-MM-DD hh:mm:ss.SSS A' }),
        align(),
        printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
    ),
    defaultMeta: { service: 'api-mbo' },
    exitOnError: false,
    transports: [
        new DailyRotateFile({
            level: 'error',
            dirname: 'logs/error',
            filename: '%DATE%.log',
            datePattern: 'YYYY-MM-DD-HH',
            maxSize: '20m',
            maxFiles: '7d',
        }),
        new DailyRotateFile({
            dirname: 'logs/combined',
            filename: '%DATE%.log',
            datePattern: 'YYYY-MM-DD-HH',
            maxSize: '60m',
            maxFiles: '7d'
        }),
        new LogtailTransport(logtail)
    ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
        format: format.simple(),
    }));
}

const stream = {
    write: (message: string) => logger.http(message.trim()),
};

export { logger, stream }