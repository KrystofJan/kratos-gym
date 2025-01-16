import { Request, Response } from 'express'
import { ReservationDatabase } from './reservation.database'
import {
    CreatedResponse,
    FailedResponse,
    OkResponse,
} from '../../request-utility'
import { logger } from '../../utils'
import { CodedError, ErrorCode } from '../../errors'
import {} from './reservation.error-handler'
import { safeAwait } from '../../utils/utilities'
import { DeletedResponse } from '../../request-utility/custom-responces/deleted-response'
import {
    ReservationService,
    reservationErrorHandler,
    Reservation,
    ReservationQueryParams,
} from '.'
import { AccountService } from '../account'
import { PlanService } from '../plan'
import { ExerciseTypeService } from '../exercise-type'
import { ExerciseCategoryService } from '../exercise-category'

export class ReservationController {
    static async FindAll(req: Request, res: Response) {
        const { limit, page } = req.query as ReservationQueryParams
        const [err, data] = await safeAwait(
            ReservationService.GetAllReservationes(limit, page)
        )
        if (err !== null) {
            logger.error(err)
            const error = err as CodedError
            const statusCode = reservationErrorHandler.handleError(error)
            const response = new FailedResponse(
                error.message,
                statusCode,
                error.code
            )
            response.buildResponse(req, res)
            return
        }

        for (const reservation of data) {
            if (!reservation.Customer) {
                const error = new CodedError(
                    ErrorCode.MAPPING_ERROR,
                    'Customer was not found for ' +
                        reservation.ReservationId +
                        ' reservation'
                )
                logger.error(error)
                const statusCode = reservationErrorHandler.handleError(error)
                const response = new FailedResponse(
                    error.message,
                    statusCode,
                    error.code
                )
                response.buildResponse(req, res)
                return
            }

            const [errAccount, account] = await safeAwait(
                AccountService.GetAccountById(reservation.Customer.AccountId)
            )
            if (errAccount !== null) {
                logger.error(errAccount)
                const error = errAccount as CodedError
                const statusCode = reservationErrorHandler.handleError(error)
                const response = new FailedResponse(
                    error.message,
                    statusCode,
                    error.code
                )
                response.buildResponse(req, res)
                return
            }
            reservation.Customer = account
            reservation.Customer.Address = undefined
            reservation.Customer.ClerkId = undefined

            if (!reservation.Plan) {
                const error = new CodedError(
                    ErrorCode.MAPPING_ERROR,
                    'Customer was not found for ' +
                        reservation.ReservationId +
                        ' reservation'
                )
                logger.error(error)
                const statusCode = reservationErrorHandler.handleError(error)
                const response = new FailedResponse(
                    error.message,
                    statusCode,
                    error.code
                )
                response.buildResponse(req, res)
                return
            }

            const [errPlan, plan] = await safeAwait(
                PlanService.GetPlanById(reservation.Plan.PlanId)
            )
            if (errPlan !== null) {
                logger.error(errPlan)
                const error = errPlan as CodedError
                const statusCode = reservationErrorHandler.handleError(error)
                const response = new FailedResponse(
                    error.message,
                    statusCode,
                    error.code
                )
                response.buildResponse(req, res)
                return
            }

            reservation.Plan = plan
            if (reservation.Plan.User) {
                reservation.Plan.User.Address = undefined
            }

            const [errMachines, machines] = await safeAwait(
                PlanService.GetMachinesInPlan(plan.PlanId)
            )
            if (errMachines !== null) {
                logger.error(errMachines)
                const error = errMachines as CodedError
                const statusCode = reservationErrorHandler.handleError(error)
                const response = new FailedResponse(
                    error.message,
                    statusCode,
                    error.code
                )
                response.buildResponse(req, res)
                return
            }

            reservation.Plan.Machines = machines

            const [typeErr, type] = await safeAwait(
                ExerciseCategoryService.GetCategoriesByPlanId(plan.PlanId)
            )

            if (typeErr !== null) {
                logger.error(typeErr)
                const error = typeErr as CodedError
                const statusCode = reservationErrorHandler.handleError(error)
                const response = new FailedResponse(
                    error.message,
                    statusCode,
                    error.code
                )
                response.buildResponse(req, res)
                return
            }
            reservation.Plan.ExerciseCategories = type

            if (reservation.Trainer) {
                const [errTrainer, trainer] = await safeAwait(
                    AccountService.GetAccountById(reservation.Trainer.AccountId)
                )
                if (errTrainer !== null) {
                    logger.error(errTrainer)
                    const error = errTrainer as CodedError
                    const statusCode =
                        reservationErrorHandler.handleError(error)
                    const response = new FailedResponse(
                        error.message,
                        statusCode,
                        error.code
                    )
                    response.buildResponse(req, res)
                    return
                }

                reservation.Trainer = trainer
                reservation.Trainer.Address = undefined
                reservation.Trainer.ClerkId = undefined
            }
        }

        const response = new OkResponse('found all data successfully', data)
        response.buildResponse(req, res)
    }

    static async FindById(req: Request, res: Response) {
        const id = Number(req.params['id'])
        const [err, reservation] = await safeAwait(
            ReservationService.GetReservationById(id)
        )
        if (err !== null) {
            logger.error(err)
            const error = err as CodedError
            const statusCode = reservationErrorHandler.handleError(error)
            const response = new FailedResponse(
                error.message,
                statusCode,
                error.code
            )
            response.buildResponse(req, res)
            return
        }

        if (!reservation.Customer) {
            const error = new CodedError(
                ErrorCode.MAPPING_ERROR,
                'Customer was not found for ' +
                    reservation.ReservationId +
                    ' reservation'
            )
            logger.error(error)
            const statusCode = reservationErrorHandler.handleError(error)
            const response = new FailedResponse(
                error.message,
                statusCode,
                error.code
            )
            response.buildResponse(req, res)
            return
        }

        const [errAccount, account] = await safeAwait(
            AccountService.GetAccountById(reservation.Customer.AccountId)
        )
        if (errAccount !== null) {
            logger.error(errAccount)
            const error = errAccount as CodedError
            const statusCode = reservationErrorHandler.handleError(error)
            const response = new FailedResponse(
                error.message,
                statusCode,
                error.code
            )
            response.buildResponse(req, res)
            return
        }
        reservation.Customer = account
        reservation.Customer.Address = undefined
        reservation.Customer.ClerkId = undefined

        if (!reservation.Plan) {
            const error = new CodedError(
                ErrorCode.MAPPING_ERROR,
                'Customer was not found for ' +
                    reservation.ReservationId +
                    ' reservation'
            )
            logger.error(error)
            const statusCode = reservationErrorHandler.handleError(error)
            const response = new FailedResponse(
                error.message,
                statusCode,
                error.code
            )
            response.buildResponse(req, res)
            return
        }

        const [errPlan, plan] = await safeAwait(
            PlanService.GetPlanById(reservation.Plan.PlanId)
        )
        if (errPlan !== null) {
            logger.error(errPlan)
            const error = errPlan as CodedError
            const statusCode = reservationErrorHandler.handleError(error)
            const response = new FailedResponse(
                error.message,
                statusCode,
                error.code
            )
            response.buildResponse(req, res)
            return
        }

        reservation.Plan = plan
        if (reservation.Plan.User) {
            reservation.Plan.User.Address = undefined
        }

        const [errMachines, machines] = await safeAwait(
            PlanService.GetMachinesInPlan(plan.PlanId)
        )
        if (errMachines !== null) {
            logger.error(errMachines)
            const error = errMachines as CodedError
            const statusCode = reservationErrorHandler.handleError(error)
            const response = new FailedResponse(
                error.message,
                statusCode,
                error.code
            )
            response.buildResponse(req, res)
            return
        }

        reservation.Plan.Machines = machines

        const [categoriesErr, categories] = await safeAwait(
            ExerciseCategoryService.GetCategoriesByPlanId(plan.PlanId)
        )

        if (categoriesErr !== null) {
            logger.error(categoriesErr)
            const error = categoriesErr as CodedError
            const statusCode = reservationErrorHandler.handleError(error)
            const response = new FailedResponse(
                error.message,
                statusCode,
                error.code
            )
            response.buildResponse(req, res)
            return
        }
        reservation.Plan.ExerciseCategories = categories

        if (reservation.Trainer) {
            const [errTrainer, trainer] = await safeAwait(
                AccountService.GetAccountById(reservation.Trainer.AccountId)
            )
            if (errTrainer !== null) {
                logger.error(errTrainer)
                const error = errTrainer as CodedError
                const statusCode = reservationErrorHandler.handleError(error)
                const response = new FailedResponse(
                    error.message,
                    statusCode,
                    error.code
                )
                response.buildResponse(req, res)
                return
            }

            reservation.Trainer = trainer
            reservation.Trainer.Address = undefined
            reservation.Trainer.ClerkId = undefined
        }

        const response = new OkResponse(
            'found all data successfully',
            reservation
        )
        response.buildResponse(req, res)
    }

    static async UpdateById(req: Request, res: Response) {
        const id = Number(req.params['id'])
        const body = req.body
        const model: Partial<Reservation> = new Reservation(body)

        if (!model.Customer || !model.Customer.AccountId) {
            model.Customer = undefined
        }

        const [err, data] = await safeAwait(
            ReservationService.UpdateReservationById(id, model)
        )

        if (err !== null) {
            logger.error(err)
            const error = err as CodedError
            const statusCode = reservationErrorHandler.handleError(error)
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
            ReservationService.DeleteReservationById(id)
        )
        if (err !== null) {
            logger.error(err)
            const error = err as CodedError
            const statusCode = reservationErrorHandler.handleError(error)
            const response = new FailedResponse(
                error.message,
                statusCode,
                error.code
            )
            response.buildResponse(req, res)
            return
        }
        const response = new DeletedResponse(
            'Successfully deleted Reservation',
            data
        )
        response.buildResponse(req, res)
    }

    static async Create(req: Request, res: Response) {
        const body = req.body
        const model = new Reservation(body)

        logger.info(model)
        if (!model.checkForUnneededData(body)) {
            const error = new CodedError(
                ErrorCode.MAPPING_ERROR,
                'TODO: Change the message'
            )
            logger.error(error)
            const statusCode = reservationErrorHandler.handleError(error)
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
            const statusCode = reservationErrorHandler.handleError(error)
            const response = new FailedResponse(
                error.message,
                statusCode,
                error.code
            )
            response.buildResponse(req, res)
            return
        }
        const [err, id] = await safeAwait(
            ReservationService.CreateReservation(model)
        )
        if (err !== null) {
            logger.error(err)
            const error = err as CodedError
            const statusCode = reservationErrorHandler.handleError(error)
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

    static async CreateFullReservation(req: Request, res: Response) {
        const body = req.body
        const model = new Reservation(body)

        if (!model.checkForUnneededData(body)) {
            const error = new CodedError(
                ErrorCode.MAPPING_ERROR,
                'TODO: Change the message'
            )
            logger.error(error)
            const statusCode = reservationErrorHandler.handleError(error)
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
            const statusCode = reservationErrorHandler.handleError(error)
            const response = new FailedResponse(
                error.message,
                statusCode,
                error.code
            )
            response.buildResponse(req, res)
            return
        }
        if (!model.Plan) {
            const error = new CodedError(
                ErrorCode.ARGUMENT_ERROR,
                'Cannot have empty Plan'
            )
            logger.error(error)
            const statusCode = reservationErrorHandler.handleError(error)
            const response = new FailedResponse(
                error.message,
                statusCode,
                error.code
            )
            response.buildResponse(req, res)
            return
        }
        const [err, id] = await safeAwait(
            ReservationService.CreateFullReservation(model)
        )

        if (err !== null) {
            logger.error(err)
            const error = err as CodedError
            const statusCode = reservationErrorHandler.handleError(error)
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
