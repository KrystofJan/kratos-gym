import { CustomResponse } from './response';
import { ResponseStatus } from '../common/response-status';
import { PostResponseBody, PostMultipleResponseBody } from './response-body';
import { StatusCodes } from 'http-status-codes';
import { Request as expressRequest, Response as expressResponse } from 'express';

export class CreatedResponse implements CustomResponse {
    public readonly StatusCode: StatusCodes;
    public readonly Body: PostResponseBody;

    constructor(message: string, createdId: number) {
        this.StatusCode = StatusCodes.CREATED;
        this.Body = {
            status: ResponseStatus.SUCCESS,
            message: message,
            CreatedId: createdId
        }
    }

    buildResponse(req: expressRequest, res: expressResponse) {
        res.status(this.StatusCode).json(this.Body);
    }
}

export class CreatedMultipleResponse implements CustomResponse {
    public readonly StatusCode: StatusCodes;
    public readonly Body: PostMultipleResponseBody;

    constructor(message: string, createdIds: Array<number>) {
        this.StatusCode = StatusCodes.CREATED;
        this.Body = {
            status: ResponseStatus.SUCCESS,
            message: message,
            CreatedIds: createdIds
        }
    }

    buildResponse(req: expressRequest, res: expressResponse) {
        res.status(this.StatusCode).json(this.Body);
    }
} 
