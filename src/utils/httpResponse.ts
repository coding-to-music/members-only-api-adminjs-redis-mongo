export class SuccessResponse {

    private status = 'success';
    public statusCode: 200 | 201 | 204;
    public message: string;
    public data?: any

    constructor(statusCode: 200 | 201 | 204, message: string, data?: any) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data
    }
}