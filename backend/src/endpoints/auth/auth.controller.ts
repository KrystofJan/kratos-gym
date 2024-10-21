import { CodedError, ErrorCode } from "../../errors";
import { AuthService } from "./auth.service";
import { FailedResponse, CreatedResponse } from "../../request-utility";
import { Auth } from "./auth.model";
import { logger } from "../../utils";
import { authErrorHandler } from "./auth.error-handler";
import { safeAwait } from "../../utils/utilities";
import { Request, Response } from "express";

export class AuthController {

    static async CreateAccount(req: Request, res: Response) {
        const body = req.body;
        const model = new Auth(body);

        if (!model.checkForUnneededData(body)) {
            const error = new CodedError(ErrorCode.MAPPING_ERROR, "TODO: Change the message");
            logger.error(error)
            const statusCode = authErrorHandler.handleError(error);
            const response = new FailedResponse(error.message, statusCode, error.code);
            response.buildResponse(req, res)
            return;
        }

        if (!model.validateAttrs()) {
            const error = new CodedError(ErrorCode.VALIDATION_ERROR, "Validation failed");
            logger.error(error)
            const statusCode = authErrorHandler.handleError(error);
            const response = new FailedResponse(error.message, statusCode, error.code);
            response.buildResponse(req, res)
            return;
        }

        const [err, account] = await safeAwait(AuthService.CreateAddress(model));
        if (err !== null) {

            logger.error(err)
            const error = err as CodedError;
            const statusCode = authErrorHandler.handleError(error);
            logger.info(statusCode)
            const response = new FailedResponse(error.message, statusCode, error.code);
            response.buildResponse(req, res)
            return;
        }

        const response = new CreatedResponse("created successfully", account);
        response.buildResponse(req, res);
    }
}
