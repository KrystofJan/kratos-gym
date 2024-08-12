import { StatusCodeType } from './Response.js';
import { ResponseStatus } from '../common/ResponseStatus.js';
export class CreatedResponse {
    constructor(message, createdId) {
        this.StatusCode = StatusCodeType.CREATED;
        this.Body = {
            status: ResponseStatus.SUCCESS,
            message: message,
            CreatedId: createdId
        };
    }
    buildResponse(req, res) {
        res.status(this.StatusCode).json(this.Body);
    }
}
export class CreatedMultipleResponse {
    constructor(message, createdIds) {
        this.StatusCode = StatusCodeType.CREATED;
        this.Body = {
            status: ResponseStatus.SUCCESS,
            message: message,
            CreatedIds: createdIds
        };
    }
    buildResponse(req, res) {
        res.status(this.StatusCode).json(this.Body);
    }
}
