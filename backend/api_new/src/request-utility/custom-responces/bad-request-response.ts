import { CustomResponse } from './response';
import { ResponseStatus } from '../common/response-status';
import { ResponseBody } from './response-body';
import { StatusCodes } from 'http-status-codes';
import { Request as expressRequest, Response as expressResponse } from 'express';

export class BadRequestResponse implements CustomResponse {
    StatusCode: StatusCodes;
    Body: ResponseBody;

    constructor(message: string) {
        this.StatusCode = StatusCodes.BAD_REQUEST;
        this.Body = {
            status: ResponseStatus.FAIL,
            message: message
        }
    }

    buildResponse(req: expressRequest, res: expressResponse) {
        res.status(this.StatusCode).json(this.Body);
    }
}
