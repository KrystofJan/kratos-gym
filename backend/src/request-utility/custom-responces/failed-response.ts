import { CustomResponse } from './response'
import { ResponseStatus } from '../common/response-status'
import { ErrorResponseBody } from './response-body'
import { StatusCodes } from 'http-status-codes'
import { Request as expressRequest, Response as expressResponse } from 'express'
import { ErrorCode } from '../../errors'

export class FailedResponse implements CustomResponse {
    StatusCode: StatusCodes
    Body: ErrorResponseBody

    constructor(message: string, statusCode: StatusCodes, errCode: ErrorCode) {
        this.StatusCode = statusCode
        this.Body = {
            status: ResponseStatus.FAIL,
            message: message,
            error_code: errCode,
        }
    }

    buildResponse(req: expressRequest, res: expressResponse) {
        res.status(this.StatusCode).json(this.Body)
    }
}
