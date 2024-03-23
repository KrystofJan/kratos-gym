import { add } from '@formkit/icons';
import { AddressDAO } from '../ORM/AccessModels/AddressDAO.js';
import { Address } from '../ORM/Models/Address.js'
import { Error } from '../ORM/Models/Error.js'
import { Response, StatusCodeType } from '../utils/RequestUtility/CustomResponces/Response.js';
import { IDictionary } from '../utils/Utilities.js';
import { OkResponse } from '../utils/RequestUtility/CustomResponces/OkResponse.js';
import { CreatedResponse } from '../utils/RequestUtility/CustomResponces/CreatedResponse.js';
import { FailedResponse } from '../utils/RequestUtility/CustomResponces/FailedResponse.js';
import { DatabaseFail, DatabaseResponse, DatabaseSuccess } from '../utils/ORMUtility/DatabaseResponse.js';

export const selectAllAdresses = async (): Promise<Response> => {
    try{
        const addressDAO = new AddressDAO();

        const body: Array<IDictionary<any>> = await addressDAO.getAll();
        
        let results: Array<Address> = new Array<Address>();

        for (const b of body){
            const a = new Address(b);
            results.push(a);

        }

        return new OkResponse("We good", results);
    }
    catch(err) {
        return new FailedResponse("Cannot get any of these things :(");
    }
}

export const selectAdressById = async (id: number): Promise<Response> => {
    try{
        const addressDAO = new AddressDAO();

        const body: IDictionary<any> = await addressDAO.get(id);
        
        let result: Address = new Address(body);

        return new OkResponse("We good", result);
    }
    catch(err) {
        return new FailedResponse("Cannot get any of these things :(");
    }
}

export const createAddress = async (body: Address) => { // create
    let result: DatabaseResponse;
    // TODO better response
    try{
        const addressDAO = new AddressDAO();
        result = await addressDAO.post(body);
        const successResult = result as DatabaseSuccess;
        console.log('Bodiiii', result);
        return new CreatedResponse(
            "Successfully created an Address", 
            successResult.Body);
    }
    catch(err){
        return new FailedResponse('Sadge');
    }
}