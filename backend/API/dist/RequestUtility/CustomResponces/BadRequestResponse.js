import { StatusCodeType } from './Response.js';
import { ResponseStatus } from '../common/ResponseStatus.js';
export class BadRequestResponse {
    constructor(message) {
        this.StatusCode = StatusCodeType.BAD_REQUEST;
        this.Body = {
            status: ResponseStatus.FAIL,
            message: message
        };
    }
    buildResponse(req, res) {
        res.status(this.StatusCode).json(this.Body);
    }
}
