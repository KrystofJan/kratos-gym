import { CustomResponse } from './response'
import { ResponseStatus } from '../common/response-status'
import { GetResponseBody } from './response-body'
import { Model } from '../../endpoints/base'
import { StatusCodes } from 'http-status-codes'
import { Request as expressRequest, Response as expressResponse } from 'express'
import { Suggestion } from '../../endpoints/machine'

export class OkResponse implements CustomResponse {
    StatusCode: StatusCodes
    Body: GetResponseBody

    constructor(message: string, body: Array<Model> | Model | Suggestion) {
        this.StatusCode = StatusCodes.OK
        this.Body = {
            status: ResponseStatus.SUCCESS,
            message: message,
            Body: body,
        }
    }

    buildResponse(req: expressRequest, res: expressResponse) {
        res.status(this.StatusCode).json(this.Body.Body)
    }
}
