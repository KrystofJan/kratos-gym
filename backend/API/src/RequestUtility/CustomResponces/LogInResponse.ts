import { Response, StatusCodeType } from './Response.js';
import { ResponseStatus } from '../common/ResponseStatus.js';
import { GetResponseBody, LogInResponseBody } from './ResponseBody.js';
import { Model } from '../../Models/Model.js';
import { Request as expressRequest, Response as expressResponse } from 'express';


export class LoggedInResponse implements Response {
    StatusCode: StatusCodeType;
    Body: LogInResponseBody;

    constructor(message: string, userId: number){
        this.StatusCode = StatusCodeType.OK;
        this.Body = {
            status: ResponseStatus.SUCCESS,
            message: message,
            userId: userId
        }
    }

    buildResponse (req: expressRequest, res: expressResponse ) {
        console.log(this.Body);
        res.status(this.StatusCode).json(this.Body);
    }
}

