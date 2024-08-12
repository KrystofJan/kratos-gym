var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { FindAllAdresses, FindAdressById, CreateAddress } from '../Managers/AddressManager.js';
import { Address } from '../Models/Address.js';
export const getAllAddresses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield FindAllAdresses();
    response.buildResponse(req, res);
});
export const getAddressById = (req, res, id) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield FindAdressById(id);
    response.buildResponse(req, res);
});
export const postAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const address = new Address(req.body);
    let response;
    // handle badrequest
    // if (!address.validateAttrs() || address === undefined) {
    //     response = new BadRequestResponse("Unable to create Address model");
    //     response.buildResponse(req, res);
    //     return;
    // }
    // not this can be either 
    response = yield CreateAddress(address);
    response.buildResponse(req, res);
});
