import { Request, Response } from 'express'
import { AddressService, Address } from '../address'
import { FailedResponse, OkResponse } from '../../request-utility'
import { CodedError, ErrorCode } from '../../errors'
import { logger } from '../../utils'
import { safeAwait } from '../../utils/utilities'
import { StatusCodes } from 'http-status-codes'
import { TestingService } from './testing.service'
import { TestingQueryParams } from './testing.params'

export class TestingController {
    static async FindAll(req: Request, res: Response) {
        const { id_name, table_name } = req.query as TestingQueryParams
        if (!id_name || !table_name) {
            logger.error('Need to have id nad table')
            const err = new CodedError(
                ErrorCode.ARGUMENT_ERROR,
                'Need to have id nad table'
            )
            const response = new FailedResponse(
                err.message,
                StatusCodes.BAD_REQUEST,
                err.code
            )
            response.buildResponse(req, res)
        }
        const [err, result] = await safeAwait(
            TestingService.GetDBId(table_name as string, id_name as string)
        )
        if (err !== null) {
            logger.error(err)
            const error = err as CodedError
            const statusCode = StatusCodes.INTERNAL_SERVER_ERROR
            const response = new FailedResponse(
                error.message,
                statusCode,
                error.code
            )
            response.buildResponse(req, res)
            return
        }
        const response = new OkResponse('Got it lol', result)
        response.buildResponse(req, res)
    }
}
