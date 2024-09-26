import { Request, Response } from 'express';
import { AccountService } from './account.service';
import { AddressService, Address } from '../address';
import { CreatedResponse, CustomResponse, FailedResponse, OkResponse } from '../../request-utility';
import { Account } from './account.model';
import { CodedError, ErrorCode } from '../../errors';
import { logger } from '../../utils';
import { accountErrorHandler } from './account.error-handler';
import { safeAwait } from '../../utils/utilities';

export class AccountController {

    static async FindAll(req: Request, res: Response) {
        const [err, data] = await safeAwait(AccountService.GetAllAccounts());
        if (err !== null) {
            logger.error(err)
            const error = err as CodedError;
            const statusCode = accountErrorHandler.handleError(error);
            const response = new FailedResponse(error.message, statusCode, error.code);
            response.buildResponse(req, res)
            return;
        }

        for (const account of data) {
            if (!account.Address.AddressId) {
                const error = new CodedError(ErrorCode.MAPPING_ERROR, "Account address id is not null");
                logger.error(error)
                const statusCode = accountErrorHandler.handleError(error);
                const response = new FailedResponse(error.message, statusCode, error.code);
                response.buildResponse(req, res)
                return;
            }
            const [err, address] = await safeAwait(AddressService.GetAddressById(Number(account.Address.AddressId)));
            if (err !== null) {
                logger.error(err)
                const error = err as CodedError;
                const statusCode = accountErrorHandler.handleError(error);
                const response = new FailedResponse(error.message, statusCode, error.code);
                response.buildResponse(req, res)
                return;
            }
            account.Address = address;
        }

        const response = new OkResponse("found all data successfully", data);
        response.buildResponse(req, res)
    }

    static async FindById(req: Request, res: Response) {
        const id = Number(req.params["id"])
        const [err, data] = await safeAwait(AccountService.GetAccountById(id));
        if (err !== null) {
            logger.error(err)
            const error = err as CodedError;
            const statusCode = accountErrorHandler.handleError(error);
            const response = new FailedResponse(error.message, statusCode, error.code);
            response.buildResponse(req, res)
            return;
        }


        if (!data.Address.AddressId) {
            const error = new CodedError(ErrorCode.MAPPING_ERROR, "Account address id is not null");
            logger.error(error)
            const statusCode = accountErrorHandler.handleError(error);
            const response = new FailedResponse(error.message, statusCode, error.code);
            response.buildResponse(req, res)
            return;
        }

        const [addrErr, address] = await safeAwait(AddressService.GetAddressById(Number(data.Address.AddressId)));
        if (addrErr !== null) {
            logger.error(addrErr)
            const error = addrErr as CodedError;
            const statusCode = accountErrorHandler.handleError(error);
            const response = new FailedResponse(error.message, statusCode, error.code);
            response.buildResponse(req, res)
            return;
        }
        data.Address = address;

        const response = new OkResponse("found all data successfully", data);
        response.buildResponse(req, res)
    }
}
