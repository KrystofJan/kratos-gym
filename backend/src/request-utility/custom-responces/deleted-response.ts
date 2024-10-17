
import { CustomResponse } from './response';
import { ResponseStatus } from '../common/response-status';
import { DelelteResponseBody } from './response-body';
import { StatusCodes } from 'http-status-codes';
import { Request as expressRequest, Response as expressResponse } from 'express';

export class DeletedResponse implements CustomResponse {
    StatusCode: StatusCodes;
    Body: DelelteResponseBody;

    constructor(message: string, body: number) {
        this.StatusCode = StatusCodes.OK;
        this.Body = {
            status: ResponseStatus.SUCCESS,
            message: message,
            DeletedId: body
        }
    }

    buildResponse(req: expressRequest, res: expressResponse) {
        res.status(this.StatusCode).json(this.Body);
    }
}
