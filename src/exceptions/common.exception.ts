import { ValidationError } from 'express-validator';
import { HttpException } from '@exceptions/http.exception';
import { Request } from 'express';

export class BadRequestException extends HttpException {

    constructor(error: string) {

        super(400, error)

        this.error = error;
    };

};

export class ConflictException extends HttpException {

    constructor(error: string) {

        super(409, error)

        this.error = error;
    };

};

export class ForbiddenException extends HttpException {

    constructor(error: string) {

        super(403, error)

        this.error = error;
    };

};

export class InternalServerErrorException extends HttpException {

    constructor(error: string) {

        super(500, error)

        this.error = error;
    };

};

export class NotFoundException extends HttpException {

    constructor(error: string) {

        super(404, error)

        this.error = error;
    };

};

export class UnAuthorizedException extends HttpException {

    constructor(error: string) {

        super(401, error)

        this.error = error;

    };

};

export class ValidationException extends HttpException {

    public errors: ValidationError[];

    constructor(errors: ValidationError[]) {

        super(400, 'Validation Errors')
        this.errors = errors
    }
};

export class LoggerException {

    public error: string;
    public errorType: string;
    public requestHost: string;
    public requestIp: string;
    public requestMethod: string;
    public requestOrigin: string;
    public statusCode: number;

    constructor(err: HttpException, req: Request) {
        this.error = err.error ?? err.message;
        this.errorType = err.errorType;
        this.requestHost = req.hostname;
        this.requestIp = req.ip;
        this.requestMethod = req.method;
        this.requestOrigin = req.originalUrl;
        this.statusCode = err.statusCode ?? 500;
    }
}