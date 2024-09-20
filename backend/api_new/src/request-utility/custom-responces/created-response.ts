import { CustomResponse, StatusCodeType } from './Response';
import { ResponseStatus } from '../common/ResponseStatus';
import { PostResponseBody, PostMultipleResponseBody } from './ResponseBody';
import { Request as expressRequest, Response as expressResponse } from 'express';

export class CreatedResponse implements CustomResponse {
    public readonly StatusCode: StatusCodeType;
    public readonly Body: PostResponseBody;

    constructor(message: string, createdId: number) {
        this.StatusCode = StatusCodeType.CREATED;
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
    public readonly StatusCode: StatusCodeType;
    public readonly Body: PostMultipleResponseBody;

    constructor(message: string, createdIds: Array<number>) {
        this.StatusCode = StatusCodeType.CREATED;
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
