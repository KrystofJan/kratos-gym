import { ErrorResponseBody } from './../RequestUtility/CustomResponces/ResponseBody.js';
import { AccountDAO } from '../DataLayer/AccessModels/AccountDAO.js';
import { Account } from '../Models/Account.js'
import { UserRegPostModel } from '../Models/PostModels/UserRegPostModel.js';
import { UserAuth } from '../Models/UserAuth.js';
import { Response } from '../RequestUtility/CustomResponces/Response.js';
import { IDictionary } from '../utils/Utilities.js';
import { OkResponse } from '../RequestUtility/CustomResponces/OkResponse.js';
import { CreatedResponse } from '../RequestUtility/CustomResponces/CreatedResponse.js';
import { FailedResponse } from '../RequestUtility/CustomResponces/FailedResponse.js';
import { DatabaseResponse, DatabaseSuccess } from '../DataLayer/Database/DatabaseResponse.js';
import { ResponseStatus } from '../RequestUtility/common/ResponseStatus.js';
import { LoggedInResponse } from '../RequestUtility/CustomResponces/LogInResponse.js';
import { AddressDAO } from '../DataLayer/AccessModels/AddressDAO.js';
import { Address } from '../Models/Address.js';
import { ForeignKey } from '../Models/Decorators/DatabaseDecorators.js';


export const FindUserById = async (id: number): Promise<Response> => {
    try {
        const userDao = new AccountDAO();
        const addressDAO = new AddressDAO()
        const body = await userDao.SelectUserById(id);


        const fkMap = Reflect.getMetadata("foreignKeyMap", Account.prototype)
        console.log(fkMap)
        for (const key in fkMap) {
            console.log(body[key], fkMap[key])
        }
        //         NOTE: Turn this into something like that
        //         for (const key in fkMap) {
        //             console.log(body[key], fkMap[key])
        //             const addr = await addressDAO.SelectAdressById(body[key])
        //             const result = new Account(body);
        //
        // j           result[fkMap[key][0]] = new Address(addr);
        //         }
        const addr = await addressDAO.SelectAdressById(body.address_id)
        const result = new Account(body);

        result.Address = new Address(addr);


        return new OkResponse("We good", result);
    }
    catch (err) {
        return new FailedResponse("Cannot get any of these things :(", 404);
    }
}

export const CreateUser = async (body: Account): Promise<Response> => {
    // TODO better response
    try {
        const userDao = new AccountDAO();

        const result = await userDao.InsertUser(body);

        const successResult = result as DatabaseSuccess;
        return new CreatedResponse(
            "Successfully created an ExerciseType",
            successResult.Body);
    }
    catch (err) {
        return new FailedResponse('Sadge', 404);
    }
}

export const LoginAuth = async (body: UserAuth) => {
    try {
        const userDao = new AccountDAO();

        let result = [];

        if (body.LoginOrEmail.includes('@')) {
            result = await userDao.SelectUserByAttribute(
                "Email",
                body.LoginOrEmail
            );
        }
        else {
            result = await userDao.SelectUserByAttribute(
                "Login",
                body.LoginOrEmail
            );
        }

        if (result.length == 0) {

            const err: ErrorResponseBody = {
                status: ResponseStatus.FAIL,
                message: "Wrong email/login!",
                error_code: 0
            };
            throw err;
        }

        const real_result: Account = result[0];

        if (real_result.Password != body.EncodedPassword) {
            const err: ErrorResponseBody = {
                status: ResponseStatus.FAIL,
                message: "Wrong password!",
                error_code: 1
            };
            throw err;
        }

        return new LoggedInResponse("We good", real_result.AccountId);
    }
    catch (err) {
        const error = err as ErrorResponseBody;
        return new FailedResponse(error.message, error.error_code);
    }
}
