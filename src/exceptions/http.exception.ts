export class HttpException extends Error {
    
    public statusCode: number;
    public error: string = '';

    constructor(statusCode: number, error: string,) {
        
        super('');
        
        this.statusCode = statusCode || 500;
        this.error = error;
        this.name = this.constructor.name || 'HTTP EXCEPTION';
        Error.captureStackTrace(this);
    }
}