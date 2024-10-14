import { Request, Response } from 'express';
import { ExerciseTypeService } from '.';
import { CreatedResponse, FailedResponse, OkResponse } from '../../request-utility';
import { ExerciseType } from '.';
import { logger } from '../../utils';
import { CodedError, ErrorCode } from '../../errors';
import { exerciseTypeErrorHandler } from '.';
import { safeAwait } from '../../utils/utilities';
import { DeletedResponse } from '../../request-utility/custom-responces/deleted-response';


export class ExerciseTypeController {

    static async FindAll(req: Request, res: Response) {
        const [err, data] = await safeAwait(ExerciseTypeService.GetAllExerciseTypes());
        if (err !== null) {
            logger.error(err)
            const error = err as CodedError;
            const statusCode = exerciseTypeErrorHandler.handleError(error);
            const response = new FailedResponse(error.message, statusCode, error.code);
            response.buildResponse(req, res)
            return;
        }

        const response = new OkResponse("found all data successfully", data);
        response.buildResponse(req, res)
    }

    static async FindById(req: Request, res: Response) {
        const id = Number(req.params["id"])
        const [err, data] = await safeAwait(ExerciseTypeService.GetExerciseTypesById(id));
        if (err !== null) {
            logger.error(err)
            const error = err as CodedError;
            const statusCode = exerciseTypeErrorHandler.handleError(error);
            const response = new FailedResponse(error.message, statusCode, error.code);
            response.buildResponse(req, res)
            return;
        }
        const response = new OkResponse("found all data successfully", data);
        response.buildResponse(req, res)
    }


    static async UpdateById(req: Request, res: Response) {
        const id = Number(req.params["id"])
        const body = req.body;
        const model: Partial<ExerciseType> = new ExerciseType(body);

        const [err, data] = await safeAwait(ExerciseTypeService.UpdateExerciseTypeById(id, model))

        if (err !== null) {
            logger.error(err)
            const error = err as CodedError;
            const statusCode = exerciseTypeErrorHandler.handleError(error);
            const response = new FailedResponse(error.message, statusCode, error.code);
            response.buildResponse(req, res)
            return;
        }
        const response = new OkResponse("found all data successfully", data);
        response.buildResponse(req, res)
    }


    static async DeleteById(req: Request, res: Response) {
        const id = Number(req.params["id"])
        const [err, data] = await safeAwait(ExerciseTypeService.DeleteExerciseTypeById(id));
        if (err !== null) {
            logger.error(err)
            const error = err as CodedError;
            const statusCode = exerciseTypeErrorHandler.handleError(error);
            const response = new FailedResponse(error.message, statusCode, error.code);
            response.buildResponse(req, res)
            return;
        }
        const response = new DeletedResponse("Successfully deleted ExerciseType", data);
        response.buildResponse(req, res)
    }

    static async Create(req: Request, res: Response) {
        const body = req.body;
        const model = new ExerciseType(body);

        logger.info(model)
        if (!model.checkForUnneededData(body)) {
            const error = new CodedError(ErrorCode.MAPPING_ERROR, "TODO: Change the message");
            logger.error(error)
            const statusCode = exerciseTypeErrorHandler.handleError(error);
            const response = new FailedResponse(error.message, statusCode, error.code);
            response.buildResponse(req, res)
            return;
        }
        if (!model.validateAttrs()) {
            const error = new CodedError(ErrorCode.VALIDATION_ERROR, "Validation failed");
            logger.error(error)
            const statusCode = exerciseTypeErrorHandler.handleError(error);
            const response = new FailedResponse(error.message, statusCode, error.code);
            response.buildResponse(req, res)
            return;
        }

        const [err, id] = await safeAwait(ExerciseTypeService.CreateExerciseType(model));
        if (err !== null) {

            logger.error(err)
            const error = err as CodedError;
            const statusCode = exerciseTypeErrorHandler.handleError(error);
            logger.info(statusCode)
            const response = new FailedResponse(error.message, statusCode, error.code);
            response.buildResponse(req, res)
            return;
        }

        const response = new CreatedResponse("created successfully", id);
        response.buildResponse(req, res)
    }
}
