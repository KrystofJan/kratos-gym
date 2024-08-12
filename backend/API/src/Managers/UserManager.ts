import { ErrorResponseBody } from './../RequestUtility/CustomResponces/ResponseBody.js';
import { AccountDAO } from '../DataLayer/AccessModels/UserDAO.js';
import { Account, UserAttrs } from '../Models/User.js'
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


export const FindAllUsers = async (): Promise<Response> => {
    try {
        const userDao = new AccountDAO();
        const body: Array<IDictionary<any>> = await userDao.SelectAllUsers();

        // validate...
        const results: Array<Account> = [];
        for (const b of body) {
            const a = new Account(b);

            results.push(a);
        }

        return new OkResponse("We good", results);
    }
    catch (err) {
        return new FailedResponse("Cannot get any of these things :(", 404);
    }
}

export const FindUserById = async (id: number): Promise<Response> => {
    try {
        const userDao = new AccountDAO();
        const addressDAO = new AddressDAO()
        const body = await userDao.SelectUserById(id);

        const addr = await addressDAO.SelectAdressById(body.address_id)
        const result = new Account(body);
        result.Address = new Address(addr);

        return new OkResponse("We good", result);
    }
    catch (err) {
        return new FailedResponse("Cannot get any of these things :(", 404);
    }
}

export const CreateUser = async (body: UserRegPostModel): Promise<Response> => {
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
                UserAttrs.Email,
                body.LoginOrEmail
            );
        }
        else {
            result = await userDao.SelectUserByAttribute(
                UserAttrs.Login,
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
