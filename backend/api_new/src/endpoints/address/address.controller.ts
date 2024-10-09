import { Request, Response } from 'express';
import { AddressService } from './address.service';
import { CreatedResponse, FailedResponse, OkResponse } from '../../request-utility';
import { Address } from './address.model';
import { logger } from '../../utils';
import { CodedError, ErrorCode } from '../../errors';
import { addressErrorHandler } from './address.error-handler';
import { safeAwait } from '../../utils/utilities';
import { DeletedResponse } from '../../request-utility/custom-responces/deleted-response';


export class AddressController {

    static async FindAll(req: Request, res: Response) {
        const [err, data] = await safeAwait(AddressService.GetAllAddresses());
        if (err !== null) {
            logger.error(err)
            const error = err as CodedError;
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
            const error = err as CodedError;
            const statusCode = addressErrorHandler.handleError(error);
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
        const model: Partial<Address> = new Address(body);

        const [err, data] = await safeAwait(AddressService.UpdateAddressById(id, model))

        if (err !== null) {
            logger.error(err)
            const error = err as CodedError;
            const statusCode = addressErrorHandler.handleError(error);
            const response = new FailedResponse(error.message, statusCode, error.code);
            response.buildResponse(req, res)
            return;
        }
        const response = new OkResponse("found all data successfully", data);
        response.buildResponse(req, res)
    }


    static async DeleteById(req: Request, res: Response) {
        const id = Number(req.params["id"])
        const [err, data] = await safeAwait(AddressService.DeleteAddressById(id));
        if (err !== null) {
            logger.error(err)
            const error = err as CodedError;
            const statusCode = addressErrorHandler.handleError(error);
            const response = new FailedResponse(error.message, statusCode, error.code);
            response.buildResponse(req, res)
            return;
        }
        const response = new DeletedResponse("Successfully deleted Address", data);
        response.buildResponse(req, res)
    }

    static async Create(req: Request, res: Response) {
        const body = req.body;
        const model = new Address(body);

        logger.info(model)
        if (!model.checkForUnneededData(body)) {
            const error = new CodedError(ErrorCode.MAPPING_ERROR, "TODO: Change the message");
            logger.error(error)
            const statusCode = addressErrorHandler.handleError(error);
            const response = new FailedResponse(error.message, statusCode, error.code);
            response.buildResponse(req, res)
            return;
        }
        if (!model.validateAttrs()) {
            const error = new CodedError(ErrorCode.VALIDATION_ERROR, "Validation failed");
            logger.error(error)
            const statusCode = addressErrorHandler.handleError(error);
            const response = new FailedResponse(error.message, statusCode, error.code);
            response.buildResponse(req, res)
            return;
        }

        const [err, id] = await safeAwait(AddressService.CreateAddress(model));
        if (err !== null) {

            logger.error(err)
            const error = err as CodedError;
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
