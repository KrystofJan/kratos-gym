import { CustomResponse } from './response';
import { ResponseStatus } from '../common/response-status';
import { LogInResponseBody } from './response-body';
import { StatusCodes } from 'http-status-codes';
import { Request as expressRequest, Response as expressResponse } from 'express';


export class LoggedInResponse implements CustomResponse {
    StatusCode: StatusCodes;
    Body: LogInResponseBody;

    constructor(message: string, userId: number) {
        this.StatusCode = StatusCodes.OK;
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

