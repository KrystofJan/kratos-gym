import { Response, StatusCodeType } from './Response.js';
import { ResponseStatus } from '../../common/ResponseStatus.js';
import { ResponseBody } from './ResponseBody.js';
import { Request as expressRequest, Response as expressResponse } from 'express';

export class FailedResponse implements Response {
    StatusCode: StatusCodeType;
    Body: ResponseBody;

    constructor(message: string){
        this.StatusCode = StatusCodeType.INTERNAL_SERVER_ERROR;
        this.Body = {
            status: ResponseStatus.FAIL,
            message: message
        }
    }

    buildResponse (req: expressRequest, res: expressResponse ) {
        res.status(this.StatusCode).json(this.Body);
    }
}
