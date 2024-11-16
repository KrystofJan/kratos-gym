import { Request, Response } from 'express';
import {
    MachineService,
    Machine,
    machineErrorHandler,
    MachineQueryParams,
} from '.'
import { CreatedResponse, FailedResponse, OkResponse } from '../../request-utility';
import { logger } from '../../utils';
import { CodedError, ErrorCode } from '../../errors';
import { safeAwait } from '../../utils/utilities';
import { DeletedResponse } from '../../request-utility/custom-responces/deleted-response';
import { ExerciseTypeService } from '../exercise-type';


export class MachineController {

    static async FindAll(req: Request, res: Response) {
        const { limit, page } = req.query as MachineQueryParams
        const [err, data] = await safeAwait(MachineService.GetAllMachines(limit, page));
        if (err !== null) {
            logger.error(err)
            const error = err as CodedError;
            const statusCode = machineErrorHandler.handleError(error);
            const response = new FailedResponse(error.message, statusCode, error.code);
            response.buildResponse(req, res)
            return;
        }

        for (const machine of data) {
            if (!machine.MachineId) {
                const error = new CodedError(ErrorCode.MAPPING_ERROR, "machine id is null");
                logger.error(error)
                const statusCode = machineErrorHandler.handleError(error);
                const response = new FailedResponse(error.message, statusCode, error.code);
                response.buildResponse(req, res)
                return;
            }

            const [typeErr, type] = await safeAwait(ExerciseTypeService.GetTypesByMachineId(Number(machine.MachineId)))

            if (typeErr !== null) {
                logger.error(typeErr)
                const error = typeErr as CodedError;
                const statusCode = machineErrorHandler.handleError(error);
                const response = new FailedResponse(error.message, statusCode, error.code);
                response.buildResponse(req, res)
                return;
            }
            machine.ExerciseTypes = type
        }

        const response = new OkResponse("found all data successfully", data);
        response.buildResponse(req, res)
    }

    static async RecommendById(req: Request, res: Response) {
        const id = Number(req.params["id"])
        const [err, data] = await safeAwait(MachineService.GetRecommendedMachines(id));
        if (err !== null) {
            logger.error(err)
            const error = err as CodedError;
            const statusCode = machineErrorHandler.handleError(error);
            const response = new FailedResponse(error.message, statusCode, error.code);
            response.buildResponse(req, res)
            return;
        }

        for (const machine of data) {
            if (!machine.MachineId) {
                const error = new CodedError(ErrorCode.MAPPING_ERROR, "machine id is null");
                logger.error(error)
                const statusCode = machineErrorHandler.handleError(error);
                const response = new FailedResponse(error.message, statusCode, error.code);
                response.buildResponse(req, res)
                return;
            }

            const [typeErr, type] = await safeAwait(ExerciseTypeService.GetTypesByMachineId(Number(machine.MachineId)))

            if (typeErr !== null) {
                logger.error(typeErr)
                const error = typeErr as CodedError;
                const statusCode = machineErrorHandler.handleError(error);
                const response = new FailedResponse(error.message, statusCode, error.code);
                response.buildResponse(req, res)
                return;
            }
            machine.ExerciseTypes = type
        }

        const response = new OkResponse("found all data successfully", data);
        response.buildResponse(req, res)
    }

    static async FindById(req: Request, res: Response) {
        const id = Number(req.params["id"])
        const [err, data] = await safeAwait(MachineService.GetMachineById(id));

        if (err !== null) {
            logger.error(err)
            const error = err as CodedError;
            const statusCode = machineErrorHandler.handleError(error);
            const response = new FailedResponse(error.message, statusCode, error.code);
            response.buildResponse(req, res)
            return;
        }

        if (!data.MachineId) {
            const error = new CodedError(ErrorCode.MAPPING_ERROR, "machine id is null");
            logger.error(error)
            const statusCode = machineErrorHandler.handleError(error);
            const response = new FailedResponse(error.message, statusCode, error.code);
            response.buildResponse(req, res)
            return;
        }

        const [typeErr, type] = await safeAwait(ExerciseTypeService.GetTypesByMachineId(Number(data.MachineId)))

        if (typeErr !== null) {
            logger.error(typeErr)
            const error = typeErr as CodedError;
            const statusCode = machineErrorHandler.handleError(error);
            const response = new FailedResponse(error.message, statusCode, error.code);
            response.buildResponse(req, res)
            return;
        }
        data.ExerciseTypes = type
        const response = new OkResponse("found all data successfully", data);
        response.buildResponse(req, res)
    }


    static async UpdateById(req: Request, res: Response) {
        const id = Number(req.params["id"])
        const body = req.body;
        const model: Partial<Machine> = new Machine(body);

        const [err, data] = await safeAwait(MachineService.UpdateMachineById(id, model))

        if (err !== null) {
            logger.error(err)
            const error = err as CodedError;
            const statusCode = machineErrorHandler.handleError(error);
            const response = new FailedResponse(error.message, statusCode, error.code);
            response.buildResponse(req, res)
            return;
        }
        const response = new OkResponse("found all data successfully", data);
        response.buildResponse(req, res)
    }


    static async DeleteById(req: Request, res: Response) {
        const id = Number(req.params["id"])
        const [err, data] = await safeAwait(MachineService.DeleteMachineById(id));
        if (err !== null) {
            logger.error(err)
            const error = err as CodedError;
            const statusCode = machineErrorHandler.handleError(error);
            const response = new FailedResponse(error.message, statusCode, error.code);
            response.buildResponse(req, res)
            return;
        }
        const response = new DeletedResponse("Successfully deleted Machine", data);
        response.buildResponse(req, res)
    }

    static async Create(req: Request, res: Response) {
        const body = req.body;
        const model = new Machine(body);

        logger.info(model)
        if (!model.checkForUnneededData(body)) {
            const error = new CodedError(ErrorCode.MAPPING_ERROR, "TODO: Change the message");
            logger.error(error)
            const statusCode = machineErrorHandler.handleError(error);
            const response = new FailedResponse(error.message, statusCode, error.code);
            response.buildResponse(req, res)
            return;
        }
        if (!model.validateAttrs()) {
            const error = new CodedError(ErrorCode.VALIDATION_ERROR, "Validation failed");
            logger.error(error)
            const statusCode = machineErrorHandler.handleError(error);
            const response = new FailedResponse(error.message, statusCode, error.code);
            response.buildResponse(req, res)
            return;
        }

        const [err, id] = await safeAwait(MachineService.CreateMachine(model));
        if (err !== null) {

            logger.error(err)
            const error = err as CodedError;
            const statusCode = machineErrorHandler.handleError(error);
            logger.info(statusCode)
            const response = new FailedResponse(error.message, statusCode, error.code);
            response.buildResponse(req, res)
            return;
        }

        const response = new CreatedResponse("created successfully", id);
        response.buildResponse(req, res)
    }

    static async AddType(req: Request, res: Response) {
        const machineId = Number(req.params["machineId"])
        const typeId = Number(req.params["typeId"])

        const [err, data] = await safeAwait(MachineService.AddExerciseType(machineId, typeId));
        if (err !== null) {
            logger.error(err)
            const error = err as CodedError;
            const statusCode = machineErrorHandler.handleError(error);
            const response = new FailedResponse(error.message, statusCode, error.code);
            response.buildResponse(req, res)
            return;
        }

        const response = new OkResponse("found all data successfully", data);
        response.buildResponse(req, res)
    }
}
