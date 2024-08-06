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
import { ExerciseTypeDAO } from './../DataLayer/AccessModels/ExerciseTypeDAO.js';
import { WrkOutMachineDAO } from './../DataLayer/AccessModels/WrkOutMachineDAO.js';
import { WrkOutPlan } from '../Models/WrkOutPlan.js';
import { OkResponse } from '../RequestUtility/CustomResponces/OkResponse.js';
import { CreatedResponse, CreatedMultipleResponse } from '../RequestUtility/CustomResponces/CreatedResponse.js';
import { FailedResponse } from '../RequestUtility/CustomResponces/FailedResponse.js';
import { WrkOutPlanDAO } from '../DataLayer/AccessModels/WrkOutPlanDAO.js';
import { AccountDAO } from '../DataLayer/AccessModels/UserDAO.js';
import { WrkOutPlanMachinesDAO } from '../DataLayer/AccessModels/WrkOutPlanMachineDAO.js';
import { Account } from '../Models/User.js';
import { WrkOutMachine } from '../Models/WrkOutMachine.js';
import { WrkOutPlanMachine } from '../Models/WrkOutPlanMachine.js';
import { WrkOutPlanTypeDAO } from '../DataLayer/AccessModels/WrkOutPlanTypeDAO.js';
import { WrkOutPlanType } from '../Models/WrkOutPlanType.js';
import { ExerciseType } from '../Models/ExerciseType.js';
export var FindAllWrkOutPlans = function () { return __awaiter(void 0, void 0, void 0, function () {
    var wrkOutPlanDao, body, results, _i, body_1, b, userDao, userData, user, a, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                wrkOutPlanDao = new WrkOutPlanDAO();
                return [4 /*yield*/, wrkOutPlanDao.SelectAllWrkOutPlans()];
            case 1:
                body = _a.sent();
                console.log(body);
                results = [];
                _i = 0, body_1 = body;
                _a.label = 2;
            case 2:
                if (!(_i < body_1.length)) return [3 /*break*/, 5];
                b = body_1[_i];
                userDao = new AccountDAO();
                console.log(b);
                return [4 /*yield*/, userDao.SelectUserById(b.accountid)];
            case 3:
                userData = _a.sent();
                console.log(userData, "");
                user = new Account(userData);
                a = new WrkOutPlan(b);
                a.User = user;
                results.push(a);
                _a.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5: return [2 /*return*/, new OkResponse("We good", results)];
            case 6:
                err_1 = _a.sent();
                return [2 /*return*/, new FailedResponse("Cannot get any of these things :(", 404)];
            case 7: return [2 /*return*/];
        }
    });
}); };
export var FindWrkOutPlanById = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var wrkOutPlanDao, body, userDao, userData, user, result, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                wrkOutPlanDao = new WrkOutPlanDAO();
                return [4 /*yield*/, wrkOutPlanDao.SelectWrkOutPlanById(id)];
            case 1:
                body = _a.sent();
                userDao = new AccountDAO();
                return [4 /*yield*/, userDao.SelectUserById(body.accountid)];
            case 2:
                userData = _a.sent();
                user = new Account(userData);
                result = new WrkOutPlan(body);
                result.User = user;
                return [2 /*return*/, new OkResponse("We good", result)];
            case 3:
                err_2 = _a.sent();
                return [2 /*return*/, new FailedResponse("Cannot get any of these things :(", 404)];
            case 4: return [2 /*return*/];
        }
    });
}); };
export var FindWrkOutMachinesContainedInId = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var wrkOutPlanMachineDao, body, result, _i, body_2, machineBody, wrkOutMachinesDAO, machineData, wrkOutMachine, wrkOutPlanMachine, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                wrkOutPlanMachineDao = new WrkOutPlanMachinesDAO();
                return [4 /*yield*/, wrkOutPlanMachineDao.SelectWrkOutPlanBy_WrkOutPlanId(id)];
            case 1:
                body = _a.sent();
                result = [];
                _i = 0, body_2 = body;
                _a.label = 2;
            case 2:
                if (!(_i < body_2.length)) return [3 /*break*/, 5];
                machineBody = body_2[_i];
                wrkOutMachinesDAO = new WrkOutMachineDAO();
                return [4 /*yield*/, wrkOutMachinesDAO.SelectWrkOutMachineById(machineBody.wrkoutmachineid)];
            case 3:
                machineData = _a.sent();
                wrkOutMachine = new WrkOutMachine(machineData);
                wrkOutPlanMachine = new WrkOutPlanMachine(machineBody);
                wrkOutPlanMachine.WrkOutMachine = wrkOutMachine;
                if (wrkOutPlanMachine.validateAttrs()) {
                    result.push(wrkOutPlanMachine);
                }
                _a.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5: return [2 /*return*/, new OkResponse("We good", result)];
            case 6:
                err_3 = _a.sent();
                return [2 /*return*/, new FailedResponse("Cannot get any of these things :(", 404)];
            case 7: return [2 /*return*/];
        }
    });
}); };
export var FindExerciseTypesContainedInId = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var wrkOutPlanTypeDAO, body, result, _i, body_3, typeBody, exerciseTypeDAO, typeData, exerciseType, wrkOutPlanType, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                wrkOutPlanTypeDAO = new WrkOutPlanTypeDAO();
                return [4 /*yield*/, wrkOutPlanTypeDAO.SelectWrkOutPlanTypeBy_WrkOutPlanId(id)];
            case 1:
                body = _a.sent();
                ;
                result = [];
                _i = 0, body_3 = body;
                _a.label = 2;
            case 2:
                if (!(_i < body_3.length)) return [3 /*break*/, 5];
                typeBody = body_3[_i];
                exerciseTypeDAO = new ExerciseTypeDAO();
                return [4 /*yield*/, exerciseTypeDAO.SelectExerciseTypeById(typeBody.ExerciseTypeId)];
            case 3:
                typeData = _a.sent();
                exerciseType = new ExerciseType(typeData);
                wrkOutPlanType = new WrkOutPlanType(typeBody);
                wrkOutPlanType.ExerciseType = exerciseType;
                if (wrkOutPlanType.validateAttrs()) {
                    result.push(wrkOutPlanType);
                }
                _a.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5: return [2 /*return*/, new OkResponse("We good", result)];
            case 6:
                err_4 = _a.sent();
                return [2 /*return*/, new FailedResponse("Cannot get any of these things :(", 404)];
            case 7: return [2 /*return*/];
        }
    });
}); };
export var AddMachineToPlan = function (body) { return __awaiter(void 0, void 0, void 0, function () {
    var wrkOutPlanMachineDao, result, successResult, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                wrkOutPlanMachineDao = new WrkOutPlanMachinesDAO();
                return [4 /*yield*/, wrkOutPlanMachineDao.InsertWrkOutPlanMachine(body)];
            case 1:
                result = _a.sent();
                successResult = result;
                return [2 /*return*/, new CreatedResponse("We good", successResult.Body)];
            case 2:
                err_5 = _a.sent();
                return [2 /*return*/, new FailedResponse("Cannot get any of these things :(", 404)];
            case 3: return [2 /*return*/];
        }
    });
}); };
export var AddMultipleMachinesToPlan = function (body) { return __awaiter(void 0, void 0, void 0, function () {
    var createdIds, _i, body_4, machine, wrkOutPlanMachineDao, result, successResult, err_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                createdIds = [];
                _i = 0, body_4 = body;
                _a.label = 1;
            case 1:
                if (!(_i < body_4.length)) return [3 /*break*/, 4];
                machine = body_4[_i];
                wrkOutPlanMachineDao = new WrkOutPlanMachinesDAO();
                return [4 /*yield*/, wrkOutPlanMachineDao.InsertWrkOutPlanMachine(machine)];
            case 2:
                result = _a.sent();
                successResult = result;
                createdIds.push(successResult.Body);
                _a.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/, new CreatedMultipleResponse("We good", createdIds)];
            case 5:
                err_6 = _a.sent();
                return [2 /*return*/, new FailedResponse("Cannot get any of these things :(", 404)];
            case 6: return [2 /*return*/];
        }
    });
}); };
export var AddTypeToPlan = function (body) { return __awaiter(void 0, void 0, void 0, function () {
    var wrkOutPlanTypeDAO, result, successResult, err_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                wrkOutPlanTypeDAO = new WrkOutPlanTypeDAO();
                return [4 /*yield*/, wrkOutPlanTypeDAO.InsertWrkOutPlanType(body)];
            case 1:
                result = _a.sent();
                successResult = result;
                return [2 /*return*/, new CreatedResponse("Successfully created an ExerciseType", successResult.Body)];
            case 2:
                err_7 = _a.sent();
                return [2 /*return*/, new FailedResponse("Cannot get any of these things :(", 404)];
            case 3: return [2 /*return*/];
        }
    });
}); };
export var CreateWrkOutPlan = function (body) { return __awaiter(void 0, void 0, void 0, function () {
    var result, wrkOutPlanDao, successResult, err_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                wrkOutPlanDao = new WrkOutPlanDAO();
                return [4 /*yield*/, wrkOutPlanDao.InsertWrkOutPlan(body)];
            case 1:
                result = _a.sent();
                successResult = result;
                return [2 /*return*/, new CreatedResponse("Successfully created an ExerciseType", successResult.Body)];
            case 2:
                err_8 = _a.sent();
                return [2 /*return*/, new FailedResponse('Sadge', 404)];
            case 3: return [2 /*return*/];
        }
    });
}); };
