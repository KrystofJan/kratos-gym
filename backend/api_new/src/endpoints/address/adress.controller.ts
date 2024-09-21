import { Request, Response } from 'express';
import { AddressService } from './address.service';
import { CreatedResponse, CustomResponse, FailedResponse, OkResponse } from '../../request-utility';
import { Address } from './address.model';
import { logger } from '../../utils';


export class AddressController {

    static async FindAll(req: Request, res: Response) {
        let response: CustomResponse;
        try {
            const data: Address[] = await AddressService.GetAllAddresses();
            response = new OkResponse("found all data successfully", data);
        } catch (err) {
            logger.error(err)
            response = new FailedResponse("failed to find all data", 500);
        }
        response.buildResponse(req, res)
    }

    static async FindById(req: Request, res: Response) {
        const id = Number(req.params["id"])
        let response: CustomResponse;
        try {
            const data: Address = await AddressService.GetAddressById(id);
            response = new OkResponse("found all data successfully", data);
        } catch (err) {
            logger.error(err)
            response = new FailedResponse("failed to find all data", 500);
        }
        response.buildResponse(req, res)
    }

    static async Create(req: Request, res: Response) {
        const model = new Address(req.body);
        // if model is valid, create it

        let response: CustomResponse;
        try {
            const createdId: number = await AddressService.CreateAddress(model);
            response = new CreatedResponse("found all data successfully", createdId);
        } catch (err) {
            logger.error(err)
            response = new FailedResponse("failed to find all data", 500);
        }
        response.buildResponse(req, res)
    }
}
