import { FindAllAdresses, FindAdressById, CreateAddress } from '../Managers/AddressManager.js';
import { Request as expressRequest, Response as expressResponse } from 'express';
import { Response } from '../utils/RequestUtility/CustomResponces/Response.js'
import { Address } from '../ORM/Models/Address.js'
import { BadRequestResponse } from '../utils/RequestUtility/CustomResponces/BadRequestResponse.js';

export const getAllAddresses = async (req: expressRequest, res: expressResponse) => {
    const response: Response = await FindAllAdresses();
    res.status(response.StatusCode).json(response.Body);
}

export const getAddressById = async (req: expressRequest, res: expressResponse,id: number) => {
    const response: Response = await FindAdressById(id);
    res.status(response.StatusCode).json(response.Body);
}

export const postAddress = async (req: expressRequest, res: expressResponse) => {
    const address = new Address(req.body);
    let response: Response;
    console.log();
    if (!address.validateAttrs()){
        response = new BadRequestResponse("Unable to create Address model");
        res.status(response.StatusCode).json(response.Body);
        return;
    }
    response = await CreateAddress(address);
    console.log(response);
    res.status(response.StatusCode).json(response.Body);
}
