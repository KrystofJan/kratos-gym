var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { LoginAuth, CreateUser, FindUserById } from './../Managers/UserManager.js';
import { UserAuth } from '../Models/UserAuth.js';
import { Account } from '../Models/Account.js';
export const LogIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userAuth = new UserAuth(req.body);
    const result = yield LoginAuth(userAuth);
    result.buildResponse(req, res);
});
export const Register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const registerBody = new Account(req.body);
    console.log(registerBody);
    const result = yield CreateUser(registerBody);
    result.buildResponse(req, res);
});
export const GetId = (req, res, id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield FindUserById(id);
    result.buildResponse(req, res);
});
