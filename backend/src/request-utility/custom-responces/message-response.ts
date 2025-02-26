import { CustomResponse } from './response'
import { ResponseStatus } from '../common/response-status'
import { ResponseBody } from './response-body'
import { Model } from '../../endpoints/base'
import { StatusCodes } from 'http-status-codes'
import { Request as expressRequest, Response as expressResponse } from 'express'
import { Suggestion } from '../../endpoints/machine'

export class MessageResponse implements CustomResponse {
    StatusCode: StatusCodes
    Body: ResponseBody

    constructor(message: string) {
        this.StatusCode = StatusCodes.OK
        this.Body = {
            message: message,
            status: ResponseStatus.SUCCESS,
        }
    }

    buildResponse(req: expressRequest, res: expressResponse) {
        res.status(this.StatusCode).json(this.Body)
    }
}
