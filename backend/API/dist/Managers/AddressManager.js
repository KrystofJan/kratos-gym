var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { AddressDAO } from '../DataLayer/AccessModels/AddressDAO.js';
import { Address } from '../Models/Address.js';
import { OkResponse } from '../RequestUtility/CustomResponces/OkResponse.js';
import { CreatedResponse } from '../RequestUtility/CustomResponces/CreatedResponse.js';
import { FailedResponse } from '../RequestUtility/CustomResponces/FailedResponse.js';
import { DatabaseSuccess } from '../DataLayer/Database/DatabaseResponse.js';
export const FindAllAdresses = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const addressDAO = new AddressDAO();
        const body = yield addressDAO.SelectAllAdresses();
        let results = new Array();
        for (const b of body) {
            const a = new Address(b);
            results.push(a);
        }
        return new OkResponse("We good", results);
    }
    catch (err) {
        return new FailedResponse("Cannot get any of these things :(", 404);
    }
});
export const FindAdressById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const addressDAO = new AddressDAO();
        const body = yield addressDAO.SelectAdressById(id);
        let result = new Address(body);
        return new OkResponse("We good", result);
    }
    catch (err) {
        return new FailedResponse(`Could not find Address with ${id} addressid`, 404);
    }
});
export const CreateAddress = (body) => __awaiter(void 0, void 0, void 0, function* () {
    // TODO better response
    const addressDAO = new AddressDAO();
    const result = yield addressDAO.InsertAddress(body);
    if (result instanceof DatabaseSuccess) {
        const successResult = result;
        return new CreatedResponse("Successfully created an Address", successResult.Body.address_id);
    }
    const res = result;
    return new FailedResponse(res.ErrorMessage, 500);
});
