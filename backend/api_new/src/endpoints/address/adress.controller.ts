import { Request, Response } from 'express';
import { CreateAddress, GetAddressById, GetAllAddresses } from './address.database';
import { CustomResponse } from '../../request-utility';
import { Address } from './address.model';


export class AddressController {

    static async FindAll(req: Request, res: Response) {
        const data: CustomResponse = await GetAllAddresses();
        data.buildResponse(req, res)
    }

    static async FindById(req: Request, res: Response) {
        const id = Number(req.params["id"])
        const data: CustomResponse = await GetAddressById(id);
        data.buildResponse(req, res)
    }

    static async Create(req: Request, res: Response) {
        const model = new Address(req.body);
        const data: CustomResponse = await CreateAddress(model)
        data.buildResponse(req, res)
    }
}
