var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { AccountDAO } from '../DataLayer/AccessModels/AccountDAO.js';
import { Account } from '../Models/Account.js';
import { OkResponse } from '../RequestUtility/CustomResponces/OkResponse.js';
import { CreatedResponse } from '../RequestUtility/CustomResponces/CreatedResponse.js';
import { FailedResponse } from '../RequestUtility/CustomResponces/FailedResponse.js';
import { ResponseStatus } from '../RequestUtility/common/ResponseStatus.js';
import { LoggedInResponse } from '../RequestUtility/CustomResponces/LogInResponse.js';
import { AddressDAO } from '../DataLayer/AccessModels/AddressDAO.js';
import { Address } from '../Models/Address.js';
export const FindUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userDao = new AccountDAO();
        const addressDAO = new AddressDAO();
        const body = yield userDao.SelectUserById(id);
        const fkMap = Reflect.getMetadata("foreignKeyMap", Account.prototype);
        console.log(fkMap);
        for (const key in fkMap) {
            console.log(body[key], fkMap[key]);
        }
        //         NOTE: Turn this into something like that
        //         for (const key in fkMap) {
        //             console.log(body[key], fkMap[key])
        //             const addr = await addressDAO.SelectAdressById(body[key])
        //             const result = new Account(body);
        //
        // j           result[fkMap[key][0]] = new Address(addr);
        //         }
        const addr = yield addressDAO.SelectAdressById(body.address_id);
        const result = new Account(body);
        result.Address = new Address(addr);
        return new OkResponse("We good", result);
    }
    catch (err) {
        return new FailedResponse("Cannot get any of these things :(", 404);
    }
});
export const CreateUser = (body) => __awaiter(void 0, void 0, void 0, function* () {
    // TODO better response
    try {
        const userDao = new AccountDAO();
        const result = yield userDao.InsertUser(body);
        const successResult = result;
        return new CreatedResponse("Successfully created an ExerciseType", successResult.Body);
    }
    catch (err) {
        return new FailedResponse('Sadge', 404);
    }
});
export const LoginAuth = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userDao = new AccountDAO();
        let result = [];
        if (body.LoginOrEmail.includes('@')) {
            result = yield userDao.SelectUserByAttribute("Email", body.LoginOrEmail);
        }
        else {
            result = yield userDao.SelectUserByAttribute("Login", body.LoginOrEmail);
        }
        if (result.length == 0) {
            const err = {
                status: ResponseStatus.FAIL,
                message: "Wrong email/login!",
                error_code: 0
            };
            throw err;
        }
        const real_result = result[0];
        if (real_result.Password != body.EncodedPassword) {
            const err = {
                status: ResponseStatus.FAIL,
                message: "Wrong password!",
                error_code: 1
            };
            throw err;
        }
        return new LoggedInResponse("We good", real_result.AccountId);
    }
    catch (err) {
        const error = err;
        return new FailedResponse(error.message, error.error_code);
    }
});
