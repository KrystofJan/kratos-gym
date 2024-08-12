import { StatusCodeType } from './Response.js';
import { ResponseStatus } from '../common/ResponseStatus.js';
export class FailedResponse {
    constructor(message, errnum) {
        this.StatusCode = StatusCodeType.INTERNAL_SERVER_ERROR;
        this.Body = {
            status: ResponseStatus.FAIL,
            message: message,
            error_code: errnum
        };
    }
    buildResponse(req, res) {
        res.status(this.StatusCode).json(this.Body);
    }
}
