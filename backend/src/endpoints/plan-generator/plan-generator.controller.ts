import { Request, Response } from 'express'
import { safeAwait } from '../../utils/utilities'
import { CodedError } from '../../errors'
import { FailedResponse } from '../../request-utility'
import { planGeneratorErrorHandler, PlanGeneratorQueryParams, PlanGeneratorService } from '.'
import { logger } from '../../utils'

export class PlanGeneratorController {
    static async FindAll(req: Request, res: Response) {
        const { collisions } = req.query as PlanGeneratorQueryParams

        const [err, data] = await safeAwait(
	    PlanGeneratorService.FetchPlanInformation()
        )
        if (err !== null) {
            logger.error(err)
            const error = err as CodedError
            const statusCode = planGeneratorErrorHandler.handleError(error)
            const response = new FailedResponse(
                error.message,
                statusCode,
                error.code
            )
            response.buildResponse(req, res)
            return
        }

        for (const plan of data) {
            if (!plan.User) {
                const error = new CodedError(
                    ErrorCode.MAPPING_ERROR,
                    'Account was not found for ' + plan.PlanId + ' plan'
                )
                logger.error(error)
                const statusCode = planErrorHandler.handleError(error)
                const response = new FailedResponse(
                    error.message,
                    statusCode,
                    error.code
                )
                response.buildResponse(req, res)
                return
            }
            const [err, account] = await safeAwait(
                AccountService.GetAccountById(plan.User.AccountId)
            )
            if (err !== null) {
                logger.error(err)
                const error = err as CodedError
                const statusCode = planErrorHandler.handleError(error)
                const response = new FailedResponse(
                    error.message,
                    statusCode,
                    error.code
                )
                response.buildResponse(req, res)
                return
            }
            plan.User = account
            plan.User.Address = undefined
            plan.User.ClerkId = undefined

            const [errMachines, machines] = await safeAwait(
                PlanService.GetMachinesInPlan(plan.PlanId)
            )
            if (errMachines !== null) {
                logger.error(errMachines)
                const error = errMachines as CodedError
                const statusCode = planErrorHandler.handleError(error)
                const response = new FailedResponse(
                    error.message,
                    statusCode,
                    error.code
                )
                response.buildResponse(req, res)
                return
            }

            plan.Machines = machines

            const [typeErr, type] = await safeAwait(
                ExerciseCategoryService.GetCategoriesByPlanId(plan.PlanId)
            )

            if (typeErr !== null) {
                logger.error(typeErr)
                const error = typeErr as CodedError
                const statusCode = planErrorHandler.handleError(error)
                const response = new FailedResponse(
                    error.message,
                    statusCode,
                    error.code
                )
                response.buildResponse(req, res)
                return
            }
            plan.ExerciseCategories = type
        }
        const response = new OkResponse('found all data successfully', data)
        response.buildResponse(req, res)
