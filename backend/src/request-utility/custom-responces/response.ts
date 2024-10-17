import { ResponseBody } from './response-body';
import { Request as expressRequest, Response as expressResponse } from 'express';
import { StatusCodes } from 'http-status-codes';


export interface CustomResponse {
    readonly StatusCode: StatusCodes;
    readonly Body: ResponseBody;
    buildResponse(req: expressRequest, res: expressResponse): void;
}
