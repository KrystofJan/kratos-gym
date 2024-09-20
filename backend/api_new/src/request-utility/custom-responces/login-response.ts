import { CustomResponse, StatusCodeType } from './Response';
import { ResponseStatus } from '../common/ResponseStatus';
import { GetResponseBody, LogInResponseBody } from './ResponseBody';
import { Model } from '../../endpoints/Model';
import { Request as expressRequest, Response as expressResponse } from 'express';


export class LoggedInResponse implements CustomResponse {
    StatusCode: StatusCodeType;
    Body: LogInResponseBody;

    constructor(message: string, userId: number) {
        this.StatusCode = StatusCodeType.OK;
        this.Body = {
            status: ResponseStatus.SUCCESS,
            message: message,
            userId: userId
        }
    }

    buildResponse(req: expressRequest, res: expressResponse) {
        res.status(this.StatusCode).json(this.Body);
    }
}

