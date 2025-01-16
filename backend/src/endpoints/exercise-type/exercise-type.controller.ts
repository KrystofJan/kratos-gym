import { Request, Response } from 'express'
import { ExerciseTypeQueryParams, ExerciseTypeService } from '.'
import {
    CreatedResponse,
    FailedResponse,
    OkResponse,
} from '../../request-utility'
import { ExerciseType } from '.'
import { logger } from '../../utils'
import { CodedError, ErrorCode } from '../../errors'
import { exerciseTypeErrorHandler } from '.'
import { safeAwait } from '../../utils/utilities'
import { DeletedResponse } from '../../request-utility/custom-responces/deleted-response'
import { ExerciseCategoryService } from '../exercise-category'

export class ExerciseTypeController {
    static async FindAll(req: Request, res: Response) {

        const { limit, page } = req.query as ExerciseTypeQueryParams
        const [err, data] = await safeAwait(
            ExerciseTypeService.GetAllExerciseTypes(limit, page)
        )
        if (err !== null) {
            logger.error(err)
            const error = err as CodedError
            const statusCode = exerciseTypeErrorHandler.handleError(error)
            const response = new FailedResponse(
                error.message,
                statusCode,
                error.code
            )
            response.buildResponse(req, res)
            return
        }

        for (const type of data) {
            if (!type.Category || !type.Category.CategoryId) {
                const error = new CodedError(
                    ErrorCode.MAPPING_ERROR,
                    'Account address id is not null'
                )
                logger.error(error)
                const statusCode = exerciseTypeErrorHandler.handleError(error)
                const response = new FailedResponse(
                    error.message,
                    statusCode,
                    error.code
                )
                response.buildResponse(req, res)
                return
            }
            const [err, category] = await safeAwait(
                ExerciseCategoryService.GetExerciseCategoryById(
                    Number(type.Category.CategoryId)
                )
            )
            if (err !== null) {
                logger.error(err)
                const error = err as CodedError
                const statusCode = exerciseTypeErrorHandler.handleError(error)
                const response = new FailedResponse(
                    error.message,
                    statusCode,
                    error.code
                )
                response.buildResponse(req, res)
                return
            }
            type.Category = category
        }

        const response = new OkResponse('found all data successfully', data)
        response.buildResponse(req, res)
    }

    static async FindById(req: Request, res: Response) {
        const id = Number(req.params['id'])
        const [err, type] = await safeAwait(
            ExerciseTypeService.GetExerciseTypesById(id)
        )
        if (err !== null) {
            logger.error(err)
            const error = err as CodedError
            const statusCode = exerciseTypeErrorHandler.handleError(error)
            const response = new FailedResponse(
                error.message,
                statusCode,
                error.code
            )
            response.buildResponse(req, res)
            return
        }

        if (!type.Category || !type.Category.CategoryId) {
            const error = new CodedError(
                ErrorCode.MAPPING_ERROR,
                'Account address id is not null'
            )
            logger.error(error)
            const statusCode = exerciseTypeErrorHandler.handleError(error)
            const response = new FailedResponse(
                error.message,
                statusCode,
                error.code
            )
            response.buildResponse(req, res)
            return
        }
        const [catErr, category] = await safeAwait(
            ExerciseCategoryService.GetExerciseCategoryById(
                Number(type.Category.CategoryId)
            )
        )
        if (catErr !== null) {
            logger.error(catErr)
            const error = catErr as CodedError
            const statusCode = exerciseTypeErrorHandler.handleError(error)
            const response = new FailedResponse(
                error.message,
                statusCode,
                error.code
            )
            response.buildResponse(req, res)
            return
        }
        type.Category = category
        const response = new OkResponse('found all data successfully', type)
        response.buildResponse(req, res)
    }

    static async FindByMachineId(req: Request, res: Response) {
        const id = Number(req.params['id'])
        const [err, data] = await safeAwait(
            ExerciseTypeService.GetTypesByMachineId(id)
        )
        if (err !== null) {
            logger.error(err)
            const error = err as CodedError
            const statusCode = exerciseTypeErrorHandler.handleError(error)
            const response = new FailedResponse(
                error.message,
                statusCode,
                error.code
            )
            response.buildResponse(req, res)
            return
        }
        for (const type of data) {
            if (!type.Category || !type.Category.CategoryId) {
                const error = new CodedError(
                    ErrorCode.MAPPING_ERROR,
                    'Account address id is not null'
                )
                logger.error(error)
                const statusCode = exerciseTypeErrorHandler.handleError(error)
                const response = new FailedResponse(
                    error.message,
                    statusCode,
                    error.code
                )
                response.buildResponse(req, res)
                return
            }
            const [err, category] = await safeAwait(
                ExerciseCategoryService.GetExerciseCategoryById(
                    Number(type.Category.CategoryId)
                )
            )
            if (err !== null) {
                logger.error(err)
                const error = err as CodedError
                const statusCode = exerciseTypeErrorHandler.handleError(error)
                const response = new FailedResponse(
                    error.message,
                    statusCode,
                    error.code
                )
                response.buildResponse(req, res)
                return
            }
            type.Category = category
        }
        const response = new OkResponse('found all data successfully', data)
        response.buildResponse(req, res)
    }

    static async UpdateById(req: Request, res: Response) {
        const id = Number(req.params['id'])
        const body = req.body
        const model: Partial<ExerciseType> = new ExerciseType(body)

        logger.info(model)
        const [err, data] = await safeAwait(
            ExerciseTypeService.UpdateExerciseTypeById(id, model)
        )

        if (err !== null) {
            logger.error(err)
            const error = err as CodedError
            const statusCode = exerciseTypeErrorHandler.handleError(error)
            const response = new FailedResponse(
                error.message,
                statusCode,
                error.code
            )
            response.buildResponse(req, res)
            return
        }
        const response = new OkResponse('found all data successfully', data)
        response.buildResponse(req, res)
    }

    static async DeleteById(req: Request, res: Response) {
        const id = Number(req.params['id'])
        const [err, data] = await safeAwait(
            ExerciseTypeService.DeleteExerciseTypeById(id)
        )
        if (err !== null) {
            logger.error(err)
            const error = err as CodedError
            const statusCode = exerciseTypeErrorHandler.handleError(error)
            const response = new FailedResponse(
                error.message,
                statusCode,
                error.code
            )
            response.buildResponse(req, res)
            return
        }
        const response = new DeletedResponse(
            'Successfully deleted ExerciseType',
            data
        )
        response.buildResponse(req, res)
    }

    static async Create(req: Request, res: Response) {
        const body = req.body
        const model = new ExerciseType(body)

        if (!model.checkForUnneededData(body)) {
            const error = new CodedError(
                ErrorCode.MAPPING_ERROR,
                'TODO: Change the message'
            )
            logger.error(error)
            const statusCode = exerciseTypeErrorHandler.handleError(error)
            const response = new FailedResponse(
                error.message,
                statusCode,
                error.code
            )
            response.buildResponse(req, res)
            return
        }
        if (!model.validateAttrs()) {
            const error = new CodedError(
                ErrorCode.VALIDATION_ERROR,
                'Validation failed'
            )
            logger.error(error)
            const statusCode = exerciseTypeErrorHandler.handleError(error)
            const response = new FailedResponse(
                error.message,
                statusCode,
                error.code
            )
            response.buildResponse(req, res)
            return
        }

        const [err, id] = await safeAwait(
            ExerciseTypeService.CreateExerciseType(model)
        )
        if (err !== null) {
            logger.error(err)
            const error = err as CodedError
            const statusCode = exerciseTypeErrorHandler.handleError(error)
            logger.info(statusCode)
            const response = new FailedResponse(
                error.message,
                statusCode,
                error.code
            )
            response.buildResponse(req, res)
            return
        }

        const response = new CreatedResponse('created successfully', id)
        response.buildResponse(req, res)
    }
}
