export class AppError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);

        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name || "Application Error";
        this.message = message || "Something went wrong";
        this.statusCode = statusCode || 500;
    }
}