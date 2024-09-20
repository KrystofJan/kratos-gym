import { CustomResponse } from './response';
import { ResponseStatus } from '../common/response-status';
import { ErrorResponseBody } from './response-body';
import { StatusCodes } from 'http-status-codes';
import { Request as expressRequest, Response as expressResponse } from 'express';

export class FailedResponse implements CustomResponse {
    StatusCode: StatusCodes;
    Body: ErrorResponseBody;

    constructor(message: string, errnum: number) {
        this.StatusCode = StatusCodes.INTERNAL_SERVER_ERROR;
        this.Body = {
            status: ResponseStatus.FAIL,
            message: message,
            error_code: errnum
        }
    }

    buildResponse(req: expressRequest, res: expressResponse) {
        res.status(this.StatusCode).json(this.Body);
    }
}
