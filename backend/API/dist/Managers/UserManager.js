var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { AccountDAO } from '../DataLayer/AccessModels/UserDAO.js';
import { Account, UserAttrs } from '../Models/User.js';
import { OkResponse } from '../RequestUtility/CustomResponces/OkResponse.js';
import { CreatedResponse } from '../RequestUtility/CustomResponces/CreatedResponse.js';
import { FailedResponse } from '../RequestUtility/CustomResponces/FailedResponse.js';
import { ResponseStatus } from '../RequestUtility/common/ResponseStatus.js';
import { LoggedInResponse } from '../RequestUtility/CustomResponces/LogInResponse.js';
import { AddressDAO } from '../DataLayer/AccessModels/AddressDAO.js';
import { Address } from '../Models/Address.js';
export var FindAllUsers = function () { return __awaiter(void 0, void 0, void 0, function () {
    var userDao, body, results, _i, body_1, b, a, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                userDao = new AccountDAO();
                return [4 /*yield*/, userDao.SelectAllUsers()];
            case 1:
                body = _a.sent();
                results = [];
                for (_i = 0, body_1 = body; _i < body_1.length; _i++) {
                    b = body_1[_i];
                    a = new Account(b);
                    results.push(a);
                }
                return [2 /*return*/, new OkResponse("We good", results)];
            case 2:
                err_1 = _a.sent();
                return [2 /*return*/, new FailedResponse("Cannot get any of these things :(", 404)];
            case 3: return [2 /*return*/];
        }
    });
}); };
export var FindUserById = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var userDao, addressDAO, body, addr, result, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                userDao = new AccountDAO();
                addressDAO = new AddressDAO();
                return [4 /*yield*/, userDao.SelectUserById(id)];
            case 1:
                body = _a.sent();
                console.log(body);
                return [4 /*yield*/, addressDAO.SelectAdressById(body.address_id)];
            case 2:
                addr = _a.sent();
                result = new Account(body);
                result.Address = new Address(addr);
                return [2 /*return*/, new OkResponse("We good", result)];
            case 3:
                err_2 = _a.sent();
                return [2 /*return*/, new FailedResponse("Cannot get any of these things :(", 404)];
            case 4: return [2 /*return*/];
        }
    });
}); };
export var CreateUser = function (body) { return __awaiter(void 0, void 0, void 0, function () {
    var userDao, result, successResult, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                userDao = new AccountDAO();
                return [4 /*yield*/, userDao.InsertUser(body)];
            case 1:
                result = _a.sent();
                successResult = result;
                return [2 /*return*/, new CreatedResponse("Successfully created an ExerciseType", successResult.Body)];
            case 2:
                err_3 = _a.sent();
                return [2 /*return*/, new FailedResponse('Sadge', 404)];
            case 3: return [2 /*return*/];
        }
    });
}); };
export var LoginAuth = function (body) { return __awaiter(void 0, void 0, void 0, function () {
    var userDao, result, err, real_result, err, err_4, error;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                userDao = new AccountDAO();
                result = [];
                if (!body.LoginOrEmail.includes('@')) return [3 /*break*/, 2];
                return [4 /*yield*/, userDao.SelectUserByAttribute(UserAttrs.Email, body.LoginOrEmail)];
            case 1:
                result = _a.sent();
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, userDao.SelectUserByAttribute(UserAttrs.Login, body.LoginOrEmail)];
            case 3:
                result = _a.sent();
                _a.label = 4;
            case 4:
                if (result.length == 0) {
                    err = {
                        status: ResponseStatus.FAIL,
                        message: "Wrong email/login!",
                        error_code: 0
                    };
                    throw err;
                }
                real_result = result[0];
                if (real_result.Password != body.EncodedPassword) {
                    err = {
                        status: ResponseStatus.FAIL,
                        message: "Wrong password!",
                        error_code: 1
                    };
                    throw err;
                }
                return [2 /*return*/, new LoggedInResponse("We good", real_result.AccountId)];
            case 5:
                err_4 = _a.sent();
                error = err_4;
                return [2 /*return*/, new FailedResponse(error.message, error.error_code)];
            case 6: return [2 /*return*/];
        }
    });
}); };
