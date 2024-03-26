import { FindAllAdresses, FindAdressById, CreateAddress } from '../Managers/AddressManager.js';
import { Request as expressRequest, Response as expressResponse } from 'express';
import { Response } from '../RequestUtility/CustomResponces/Response.js'
import { Address } from '../Models/Address.js'
import { BadRequestResponse } from '../RequestUtility/CustomResponces/BadRequestResponse.js';

export const getAllAddresses = async (req: expressRequest, res: expressResponse) => {
    const response: Response = await FindAllAdresses();
    response.buildResponse(req, res);
}

export const getAddressById = async (req: expressRequest, res: expressResponse,id: number) => {
    const response: Response = await FindAdressById(id);
    response.buildResponse(req, res);
}

export const postAddress = async (req: expressRequest, res: expressResponse) => {
    const address = new Address(req.body);
    let response: Response;
    console.log();
    if (!address.validateAttrs()){
        response = new BadRequestResponse("Unable to create Address model");
        response.buildResponse(req, res);
        return;
    }
    response = await CreateAddress(address);
    response.buildResponse(req, res);
}
