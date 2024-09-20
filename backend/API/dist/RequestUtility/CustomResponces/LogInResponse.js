import { StatusCodeType } from './Response.js';
import { ResponseStatus } from '../common/ResponseStatus.js';
export class LoggedInResponse {
    constructor(message, userId) {
        this.StatusCode = StatusCodeType.OK;
        this.Body = {
            status: ResponseStatus.SUCCESS,
            message: message,
            userId: userId
        };
    }
    buildResponse(req, res) {
        res.status(this.StatusCode).json(this.Body);
    }
}
