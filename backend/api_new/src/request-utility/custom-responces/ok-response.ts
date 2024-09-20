import { CustomResponse, StatusCodeType } from './Response';
import { ResponseStatus } from '../common/ResponseStatus';
import { GetResponseBody } from './ResponseBody';
import { Model } from '../../endpoints/Model';
import { Request as expressRequest, Response as expressResponse } from 'express';

export class OkResponse implements CustomResponse {
    StatusCode: StatusCodeType;
    Body: GetResponseBody;

    constructor(message: string, body: Array<Model> | Model) {
        this.StatusCode = StatusCodeType.OK;
        this.Body = {
            status: ResponseStatus.SUCCESS,
            message: message,
            Body: body
        }
    }

    buildResponse(req: expressRequest, res: expressResponse) {
        res.status(this.StatusCode).json(this.Body.Body);
    }
}
