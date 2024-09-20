import { CustomResponse } from './response';
import { StatusCodes } from 'http-status-codes';
import { ResponseStatus } from '../common/response-status';
import { ResponseBody } from './response-body';
import { Request as expressRequest, Response as expressResponse } from 'express';

export class NotFoundResponse implements CustomResponse {
    StatusCode: StatusCodes;
    Body: ResponseBody;

    constructor(message: string) {
        this.StatusCode = StatusCodes.NOT_FOUND;
        this.Body = {
            status: ResponseStatus.FAIL,
            message: message
        }
    }

    buildResponse(req: expressRequest, res: expressResponse) {
        res.status(this.StatusCode).json(this.Body);
    }
}
