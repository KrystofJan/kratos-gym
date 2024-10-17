import { Request, Response } from 'express';
import { PlanService, Plan, planErrorHandler } from '.';

import { ExerciseTypeService } from '../exercise-type';
import { CreatedResponse, FailedResponse, OkResponse } from '../../request-utility';
import { logger } from '../../utils';
import { CodedError, ErrorCode } from '../../errors';
import { safeAwait } from '../../utils/utilities';
import { DeletedResponse } from '../../request-utility/custom-responces/deleted-response';
import { AccountService } from '../account/account.service';
import { MachinesInPlan } from './machines-in-plan.model';

export class PlanController {

    static async FindAll(req: Request, res: Response) {
        const [err, data] = await safeAwait(PlanService.GetAllPlanes());
        if (err !== null) {
            logger.error(err)
            const error = err as CodedError;
            const statusCode = planErrorHandler.handleError(error);
            const response = new FailedResponse(error.message, statusCode, error.code);
            response.buildResponse(req, res)
            return;
        }

        for (const plan of data) {
            if (!plan.User) {
                const error = new CodedError(ErrorCode.MAPPING_ERROR, "Account was not found for " + plan.PlanId + " plan");
                logger.error(error)
                const statusCode = planErrorHandler.handleError(error);
                const response = new FailedResponse(error.message, statusCode, error.code);
                response.buildResponse(req, res)
                return;
            }
            const [err, account] = await safeAwait(AccountService.GetAccountById(plan.User.AccountId));
            if (err !== null) {
                logger.error(err)
                const error = err as CodedError;
                const statusCode = planErrorHandler.handleError(error);
                const response = new FailedResponse(error.message, statusCode, error.code);
                response.buildResponse(req, res)
                return;
            }
            plan.User = account;
            plan.User.Address = undefined;
            plan.User.ClerkId = undefined;

            const [errMachines, machines] = await safeAwait(PlanService.GetMachinesInPlan(plan.PlanId));
            if (errMachines !== null) {
                logger.error(errMachines)
                const error = errMachines as CodedError;
                const statusCode = planErrorHandler.handleError(error);
                const response = new FailedResponse(error.message, statusCode, error.code);
                response.buildResponse(req, res)
                return;
            }

            plan.Machines = machines

            const [typeErr, type] = await safeAwait(ExerciseTypeService.GetTypesByMachineId(plan.PlanId))

            if (typeErr !== null) {
                logger.error(typeErr)
                const error = typeErr as CodedError;
                const statusCode = planErrorHandler.handleError(error);
                const response = new FailedResponse(error.message, statusCode, error.code);
                response.buildResponse(req, res)
                return;
            }
            plan.ExerciseTypes = type
        }
        const response = new OkResponse("found all data successfully", data);
        response.buildResponse(req, res)
    }

    static async FindById(req: Request, res: Response) {
        const id = Number(req.params["id"])
        const [err, plan] = await safeAwait(PlanService.GetPlanById(id));
        if (err !== null) {
            logger.error(err)
            const error = err as CodedError;
            const statusCode = planErrorHandler.handleError(error);
            const response = new FailedResponse(error.message, statusCode, error.code);
            response.buildResponse(req, res)
            return;
        }

        if (!plan.User) {
            const error = new CodedError(ErrorCode.MAPPING_ERROR, "Account was not found for " + plan.PlanId + " plan");
            logger.error(error)
            const statusCode = planErrorHandler.handleError(error);
            const response = new FailedResponse(error.message, statusCode, error.code);
            response.buildResponse(req, res)
            return;
        }

        const [errAccount, account] = await safeAwait(AccountService.GetAccountById(plan.User.AccountId));
        if (errAccount !== null) {
            logger.error(errAccount)
            const error = errAccount as CodedError;
            const statusCode = planErrorHandler.handleError(error);
            const response = new FailedResponse(error.message, statusCode, error.code);
            response.buildResponse(req, res)
            return;
        }
        plan.User = account;
        plan.User.Address = undefined;
        plan.User.ClerkId = undefined

        const [errMachines, machines] = await safeAwait(PlanService.GetMachinesInPlan(plan.PlanId));
        if (errMachines !== null) {
            logger.error(errMachines)
            const error = errMachines as CodedError;
            const statusCode = planErrorHandler.handleError(error);
            const response = new FailedResponse(error.message, statusCode, error.code);
            response.buildResponse(req, res)
            return;
        }

        plan.Machines = machines

        const [typeErr, type] = await safeAwait(ExerciseTypeService.GetTypesByMachineId(plan.PlanId))

        if (typeErr !== null) {
            logger.error(typeErr)
            const error = typeErr as CodedError;
            const statusCode = planErrorHandler.handleError(error);
            const response = new FailedResponse(error.message, statusCode, error.code);
            response.buildResponse(req, res)
            return;
        }
        plan.ExerciseTypes = type

        const response = new OkResponse("found all data successfully", plan);
        response.buildResponse(req, res)
    }


    static async UpdateById(req: Request, res: Response) {
        const id = Number(req.params["id"])
        const body = req.body;
        const model: Partial<Plan> = new Plan(body);

        const [err, data] = await safeAwait(PlanService.UpdatePlanById(id, model))

        if (err !== null) {
            logger.error(err)
            const error = err as CodedError;
            const statusCode = planErrorHandler.handleError(error);
            const response = new FailedResponse(error.message, statusCode, error.code);
            response.buildResponse(req, res)
            return;
        }
        const response = new OkResponse("found all data successfully", data);
        response.buildResponse(req, res)
    }


    static async UpdateMachineByBothIds(req: Request, res: Response) {
        const machineId = Number(req.params["machineId"])
        const planId = Number(req.params["planId"])
        const body = req.body;
        const model: Partial<MachinesInPlan> = new MachinesInPlan(body);
        model.MachineId = machineId
        model.PlanId = planId

        const [err, data] = await safeAwait(PlanService.UpdateMachineInPlan(planId, machineId, model))

        if (err !== null) {
            logger.error(err)
            const error = err as CodedError;
            const statusCode = planErrorHandler.handleError(error);
            const response = new FailedResponse(error.message, statusCode, error.code);
            response.buildResponse(req, res)
            return;
        }
        const response = new OkResponse("found all data successfully", data);
        response.buildResponse(req, res)
    }

    static async DeleteById(req: Request, res: Response) {
        const id = Number(req.params["id"])
        const [err, data] = await safeAwait(PlanService.DeletePlanById(id));
        if (err !== null) {
            logger.error(err)
            const error = err as CodedError;
            const statusCode = planErrorHandler.handleError(error);
            const response = new FailedResponse(error.message, statusCode, error.code);
            response.buildResponse(req, res)
            return;
        }
        const response = new DeletedResponse("Successfully deleted Plan", data);
        response.buildResponse(req, res)
    }

    static async Create(req: Request, res: Response) {
        const body = req.body;
        const model = new Plan(body);

        if (!model.checkForUnneededData(body)) {
            const error = new CodedError(ErrorCode.MAPPING_ERROR, "TODO: Change the message");
            logger.error(error)
            const statusCode = planErrorHandler.handleError(error);
            const response = new FailedResponse(error.message, statusCode, error.code);
            response.buildResponse(req, res)
            return;
        }

        if (!model.validateAttrs()) {
            const error = new CodedError(ErrorCode.VALIDATION_ERROR, "Validation failed");
            logger.error(error)
            const statusCode = planErrorHandler.handleError(error);
            const response = new FailedResponse(error.message, statusCode, error.code);
            response.buildResponse(req, res)
            return;
        }

        const [err, id] = await safeAwait(PlanService.CreatePlan(model));
        if (err !== null) {

            logger.error(err)
            const error = err as CodedError;
            const statusCode = planErrorHandler.handleError(error);
            logger.info(statusCode)
            const response = new FailedResponse(error.message, statusCode, error.code);
            response.buildResponse(req, res)
            return;
        }

        const response = new CreatedResponse("created successfully", id);
        response.buildResponse(req, res)
    }

    static async FindPlanMachines(req: Request, res: Response) {
        const id = Number(req.params["id"])

        const [errMachines, machines] = await safeAwait(PlanService.GetMachinesByPlanId(id));
        if (errMachines !== null) {
            logger.error(errMachines)
            const error = errMachines as CodedError;
            const statusCode = planErrorHandler.handleError(error);
            const response = new FailedResponse(error.message, statusCode, error.code);
            response.buildResponse(req, res)
            return;
        }
        const response = new OkResponse("found all data successfully", machines);
        response.buildResponse(req, res)
    }


    static async AddMachine(req: Request, res: Response) {
        const body = req.body
        const machineId = Number(req.params["machineId"])
        const planId = Number(req.params["planId"])
        const model = new MachinesInPlan(body);
        model.PlanId = planId
        model.MachineId = machineId

        if (!model.checkForUnneededData(body)) {
            const error = new CodedError(ErrorCode.MAPPING_ERROR, "TODO: Change the message");
            logger.error(error)
            const statusCode = planErrorHandler.handleError(error);
            const response = new FailedResponse(error.message, statusCode, error.code);
            response.buildResponse(req, res)
            return;
        }

        if (!model.validateAttrs()) {
            const error = new CodedError(ErrorCode.VALIDATION_ERROR, "Validation failed");
            logger.error(error)
            const statusCode = planErrorHandler.handleError(error);
            const response = new FailedResponse(error.message, statusCode, error.code);
            response.buildResponse(req, res)
            return;
        }

        const [err, data] = await safeAwait(PlanService.AddMachine(model));
        if (err !== null) {
            logger.error(err)
            const error = err as CodedError;
            const statusCode = planErrorHandler.handleError(error);
            const response = new FailedResponse(error.message, statusCode, error.code);
            response.buildResponse(req, res)
            return;
        }

        const response = new OkResponse("found all data successfully", data);
        response.buildResponse(req, res)
    }

    static async RemoveMachineFromPlan(req: Request, res: Response) {
        const machineId = Number(req.params["machineId"])
        const planId = Number(req.params["planId"])

        const [err, data] = await safeAwait(PlanService.DeleteMachineRecordFromPlan(machineId, planId));
        if (err !== null) {
            logger.error(err)
            const error = err as CodedError;
            const statusCode = planErrorHandler.handleError(error);
            const response = new FailedResponse(error.message, statusCode, error.code);
            response.buildResponse(req, res)
            return;
        }
        const response = new DeletedResponse("Successfully deleted Machine", data);
        response.buildResponse(req, res)
    }

    static async RemoveTypeFromPlan(req: Request, res: Response) {
        const typeId = Number(req.params["typeId"])
        const planId = Number(req.params["planId"])

        const [err, data] = await safeAwait(PlanService.DeleteTypeRecordFromPlan(typeId, planId));
        if (err !== null) {
            logger.error(err)
            const error = err as CodedError;
            const statusCode = planErrorHandler.handleError(error);
            const response = new FailedResponse(error.message, statusCode, error.code);
            response.buildResponse(req, res)
            return;
        }
        const response = new DeletedResponse("Successfully deleted Type", data);
        response.buildResponse(req, res)
    }


    static async AddType(req: Request, res: Response) {
        const planId = Number(req.params["planId"])
        const typeId = Number(req.params["typeId"])

        const [err, data] = await safeAwait(PlanService.AddExerciseType(planId, typeId));
        if (err !== null) {
            logger.error(err)
            const error = err as CodedError;
            const statusCode = planErrorHandler.handleError(error);
            const response = new FailedResponse(error.message, statusCode, error.code);
            response.buildResponse(req, res)
            return;
        }

        const response = new OkResponse("found all data successfully", data);
        response.buildResponse(req, res)
    }


    static async FindTypes(req: Request, res: Response) {
        const id = Number(req.params["id"])
        const [typeErr, type] = await safeAwait(ExerciseTypeService.GetTypesByMachineId(id))

        if (typeErr !== null) {
            logger.error(typeErr)
            const error = typeErr as CodedError;
            const statusCode = planErrorHandler.handleError(error);
            const response = new FailedResponse(error.message, statusCode, error.code);
            response.buildResponse(req, res)
            return;
        }

        const response = new OkResponse("found all data successfully", type);
        response.buildResponse(req, res)
    }

}
