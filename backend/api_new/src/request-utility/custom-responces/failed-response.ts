import { CustomResponse, StatusCodeType } from './Response';
import { ResponseStatus } from '../common/ResponseStatus';
import { ErrorResponseBody } from './ResponseBody';
import { Request as expressRequest, Response as expressResponse } from 'express';

export class FailedResponse implements CustomResponse {
    StatusCode: StatusCodeType;
    Body: ErrorResponseBody;

    constructor(message: string, errnum: number) {
        this.StatusCode = StatusCodeType.INTERNAL_SERVER_ERROR;
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
