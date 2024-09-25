import { Request, Response } from 'express';
import { AddressService } from './address.service';
import { CreatedResponse, CustomResponse, FailedResponse, OkResponse } from '../../request-utility';
import { Address } from './address.model';
import { logger } from '../../utils';
import { BaseError, ErrorCode } from '../../errors';
import { addressErrorHandler } from './address.error-handler';
import { safeAwait } from '../../utils/utilities';


export class AddressController {

    static async FindAll(req: Request, res: Response) {
        const [err, data] = await safeAwait(AddressService.GetAllAddresses());
        if (err !== null) {
            logger.error(err)
            const error = err as BaseError;
            const statusCode = addressErrorHandler.handleError(error);
            const response = new FailedResponse(error.message, statusCode, error.code);
            response.buildResponse(req, res)
            return;
        }

        const response = new OkResponse("found all data successfully", data);
        response.buildResponse(req, res)
    }

    static async FindById(req: Request, res: Response) {
        const id = Number(req.params["id"])
        const [err, data] = await safeAwait(AddressService.GetAddressById(id));
        if (err !== null) {
            logger.error(err)
            const error = err as BaseError;
            const statusCode = addressErrorHandler.handleError(error);
            const response = new FailedResponse(error.message, statusCode, error.code);
            response.buildResponse(req, res)
            return;
        }
        const response = new OkResponse("found all data successfully", data);
        response.buildResponse(req, res)
    }

    static async Create(req: Request, res: Response) {
        const body = req.body;
        const model = new Address(body);

        if (!model.checkForUnneededData(body)) {
            const error = new BaseError(ErrorCode.MAPPING_ERROR, "TODO: Change the message");
            logger.error(error)
            const statusCode = addressErrorHandler.handleError(error);
            const response = new FailedResponse(error.message, statusCode, error.code);
            response.buildResponse(req, res)
            return;
        }
        if (!model.validateAttrs()) {
            const error = new BaseError(ErrorCode.VALIDATION_ERROR, "Validation failed");
            logger.error(error)
            const statusCode = addressErrorHandler.handleError(error);
            const response = new FailedResponse(error.message, statusCode, error.code);
            response.buildResponse(req, res)
            return;
        }

        const [err, id] = await safeAwait(AddressService.CreateAddress(model));
        if (err !== null) {

            logger.error(err)
            const error = err as BaseError;
            const statusCode = addressErrorHandler.handleError(error);
            logger.info(statusCode)
            const response = new FailedResponse(error.message, statusCode, error.code);
            response.buildResponse(req, res)
            return;
        }

        const response = new CreatedResponse("created successfully", id);
        response.buildResponse(req, res)
    }
}
