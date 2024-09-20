import { StatusCodeType } from './Response.js';
import { ResponseStatus } from '../common/ResponseStatus.js';
export class OkResponse {
    constructor(message, body) {
        this.StatusCode = StatusCodeType.OK;
        this.Body = {
            status: ResponseStatus.SUCCESS,
            message: message,
            Body: body
        };
    }
    buildResponse(req, res) {
        res.status(this.StatusCode).json(this.Body.Body);
    }
}
