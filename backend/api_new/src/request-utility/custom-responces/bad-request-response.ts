import { IDictionary } from "../../utils/Utilities.js";
import { CustomResponse, StatusCodeType } from './Response';
import { ResponseStatus } from '../common/ResponseStatus';
import { ResponseBody } from './ResponseBody';
import { Request as expressRequest, Response as expressResponse } from 'express';

export class BadRequestResponse implements CustomResponse {
    StatusCode: StatusCodeType;
    Body: ResponseBody;

    constructor(message: string) {
        this.StatusCode = StatusCodeType.BAD_REQUEST;
        this.Body = {
            status: ResponseStatus.FAIL,
            message: message
        }
    }

    buildResponse(req: expressRequest, res: expressResponse) {
        res.status(this.StatusCode).json(this.Body);
    }
}
