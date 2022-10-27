export class HttpException extends Error {

    public statusCode: number;
    public error: string = '';
    public errorType: string

    constructor(statusCode: number, error: string,) {

        super('');

        this.statusCode = statusCode || 500;
        this.error = error;
        this.errorType = this.constructor.name || 'HttpException';
        Error.captureStackTrace(this);
    }
}