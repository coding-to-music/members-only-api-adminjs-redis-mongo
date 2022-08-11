import { ValidationError } from 'express-validator';
import { HttpException } from '@exceptions/HttpException';

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