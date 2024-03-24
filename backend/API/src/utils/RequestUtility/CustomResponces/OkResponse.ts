import { Response, StatusCodeType } from './Response.js';
import { ResponseStatus } from '../../common/ResponseStatus.js';
import { GetResponseBody } from './ResponseBody.js';
import { Model } from '../../../Models/Model.js';
import { Request as expressRequest, Response as expressResponse } from 'express';

export class OkResponse implements Response {
    StatusCode: StatusCodeType;
    Body: GetResponseBody;

    constructor(message: string, body: Array<Model> | Model){
        this.StatusCode = StatusCodeType.OK;
        this.Body = {
            status: ResponseStatus.SUCCESS,
            message: message,
            Body: body
        }
    }

    buildResponse (req: expressRequest, res: expressResponse ) {
        res.status(this.StatusCode).json(this.Body.Body);
    }
}