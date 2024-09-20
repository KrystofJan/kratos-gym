import { AddressDAO } from '../DataLayer/AccessModels/AddressDAO.js';
import { Address } from '../Models/Address.js'
import { Response } from '../RequestUtility/CustomResponces/Response.js';
import { IDictionary } from '../utils/Utilities.js';
import { OkResponse } from '../RequestUtility/CustomResponces/OkResponse.js';
import { CreatedResponse } from '../RequestUtility/CustomResponces/CreatedResponse.js';
import { FailedResponse } from '../RequestUtility/CustomResponces/FailedResponse.js';
import { DatabaseFail, DatabaseResponse, DatabaseSuccess } from '../DataLayer/Database/DatabaseResponse.js';
import { AddressPostModel } from '../Models/PostModels/AddressPostModel.js';
import { logger } from '../utils/logger.js';

export const FindAllAdresses = async (): Promise<Response> => {
    try {
        const addressDAO = new AddressDAO();
        const body: any = await addressDAO.SelectAllAdresses();
        let results: Array<Address> = new Array<Address>();

        for (const b of body) {
            const a = new Address(b);
            results.push(a);
        }

        return new OkResponse("We good", results);
    }
    catch (err) {
        return new FailedResponse("Cannot get any of these things :(", 404);
    }
}

export const FindAdressById = async (id: number): Promise<Response> => {
    try {
        const addressDAO = new AddressDAO();

        const body: IDictionary<any> = await addressDAO.SelectAdressById(id);

        let result: Address = new Address(body);

        return new OkResponse("We good", result);
    }
    catch (err) {
        return new FailedResponse(`Could not find Address with ${id} addressid`, 404);
    }
}

export const CreateAddress = async (body: Address) => {
    // TODO better response
    const addressDAO = new AddressDAO();
    const result: DatabaseResponse = await addressDAO.InsertAddress(body);

    if (result instanceof DatabaseSuccess) {
        const successResult = result as DatabaseSuccess;
        return new CreatedResponse(
            "Successfully created an Address",
            successResult.Body.address_id);
    }

    const res = result as DatabaseFail;
    return new FailedResponse(res.ErrorMessage, 500)
}
