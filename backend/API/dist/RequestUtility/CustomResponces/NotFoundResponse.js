import { StatusCodeType } from './Response.js';
import { ResponseStatus } from '../common/ResponseStatus.js';
export class NotFoundResponse {
    constructor(message) {
        this.StatusCode = StatusCodeType.NOT_FOUND;
        this.Body = {
            status: ResponseStatus.FAIL,
            message: message
        };
    }
    buildResponse(req, res) {
        res.status(this.StatusCode).json(this.Body);
    }
}
