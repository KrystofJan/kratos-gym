import { ResponseBody } from './ResponseBody.js';
import { Request as expressRequest, Response as expressResponse } from 'express';

export enum StatusCodeType {
    OK = 200,
    CREATED = 201,
    ACCEPTED = 202,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    NOT_FOUND = 404,
    REQUEST_TIMEOUT = 408,
    GATEWAY_TIMEOUT = 504,
    INTERNAL_SERVER_ERROR = 500,
    NOT_IMPLEMENTED = 501
}

export interface Response {
    readonly StatusCode: StatusCodeType;
    readonly Body: ResponseBody;
    buildResponse(req: expressRequest, res: expressResponse): void;
}
