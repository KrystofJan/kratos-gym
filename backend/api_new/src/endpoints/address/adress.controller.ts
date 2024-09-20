import { Request, Response } from 'express';
import { GetAllAddresses } from './address.database';
import { CustomResponse } from '../../request-utility';


export class AddressController {

    static async FindAll(req: Request, res: Response) {
        const data: CustomResponse = await GetAllAddresses();
        data.buildResponse(req, res)
    }
}
