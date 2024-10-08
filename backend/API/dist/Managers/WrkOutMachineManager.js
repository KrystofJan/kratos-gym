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
import { Machine } from '../Models/Machine.js';
import { OkResponse } from '../RequestUtility/CustomResponces/OkResponse.js';
import { CreatedResponse } from '../RequestUtility/CustomResponces/CreatedResponse.js';
import { FailedResponse } from '../RequestUtility/CustomResponces/FailedResponse.js';
import { MachineDAO } from '../DataLayer/AccessModels/MachineDAO.js';
import { PlanMachinesDAO } from '../DataLayer/AccessModels/PlanMachineDAO.js';
import { OccupiedMachinesGetModel } from '../Models/GetModels/OccupiedMachinesGetModel.js';
export var FindAllMachines = function () { return __awaiter(void 0, void 0, void 0, function () {
    var wrkOutMachineDao, body, results, _i, body_1, b, a, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                wrkOutMachineDao = new MachineDAO();
                return [4 /*yield*/, wrkOutMachineDao.SelectAllMachines()];
            case 1:
                body = _a.sent();
                results = [];
                for (_i = 0, body_1 = body; _i < body_1.length; _i++) {
                    b = body_1[_i];
                    a = new Machine(b);
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
export var FindMachineById = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var wrkOutMachineDao, body, result, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                wrkOutMachineDao = new MachineDAO();
                return [4 /*yield*/, wrkOutMachineDao.SelectMachineById(id)];
            case 1:
                body = _a.sent();
                result = new Machine(body);
                return [2 /*return*/, new OkResponse("We good", result)];
            case 2:
                err_2 = _a.sent();
                return [2 /*return*/, new FailedResponse("Cannot get any of these things :(", 404)];
            case 3: return [2 /*return*/];
        }
    });
}); };
export var FindOccupiedMachinesOnSpecificTime = function (id, time, date) { return __awaiter(void 0, void 0, void 0, function () {
    var wrkOutPlanMachineDao, body, result, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                wrkOutPlanMachineDao = new PlanMachinesDAO();
                return [4 /*yield*/, wrkOutPlanMachineDao.SelectOccupiedMachineAmount(id, time, date)];
            case 1:
                body = _a.sent();
                result = new OccupiedMachinesGetModel(body);
                return [2 /*return*/, new OkResponse("We good", result)];
            case 2:
                err_3 = _a.sent();
                return [2 /*return*/, new FailedResponse("Cannot get any of these things :(", 404)];
            case 3: return [2 /*return*/];
        }
    });
}); };
// TODO: Probably dont even need this tbh
// export const FindMachinesByPlanId = async (id: number) => {
//     try {
//         const wrkOutPlanMachineDao = new PlanMachinesDAO();
//         const body: Array<WrkoutPlanMachineGetModel> = await wrkOutPlanMachineDao.SelectPlanBy_PlanId(id);
//         const result: Array<PlanMachine> = [];
//         for(const machineBody of body) {
//             const wrkOutMachinesDAO = new MachineDAO();
//             const machineData = await wrkOutMachinesDAO.SelectMachineById(machineBody.MachineId);
//             const wrkOutMachine = new Machine(machineData);
//             const wrkOutPlanMachine = new PlanMachine(machineBody);
//             wrkOutPlanMachine.Machine = wrkOutMachine;
//             if (wrkOutPlanMachine.validateAttrs()){
//                 result.push(wrkOutPlanMachine);
//             }
//         }
//         return new OkResponse("We good", result);
//     }
//     catch(err){
//         return new FailedResponse("Cannot get any of these things :(", 404);
//     }
// }
export var CreateMachine = function (body) { return __awaiter(void 0, void 0, void 0, function () {
    var result, wrkOutMachineDao, successResult, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                wrkOutMachineDao = new MachineDAO();
                return [4 /*yield*/, wrkOutMachineDao.InsertMachine(body)];
            case 1:
                result = _a.sent();
                successResult = result;
                return [2 /*return*/, new CreatedResponse("Successfully created an ExerciseType", successResult.Body)];
            case 2:
                err_4 = _a.sent();
                return [2 /*return*/, new FailedResponse('Sadge', 404)];
            case 3: return [2 /*return*/];
        }
    });
}); };
export var RecommendMachine = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var result, wrkOutMachineDao, successResult, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                wrkOutMachineDao = new MachineDAO();
                return [4 /*yield*/, wrkOutMachineDao.RecommendMachine(id)];
            case 1:
                result = _a.sent();
                successResult = result;
                return [2 /*return*/, new CreatedResponse("Successfully created an ExerciseType", successResult.Body)];
            case 2:
                err_5 = _a.sent();
                return [2 /*return*/, new FailedResponse('Sadge', 404)];
            case 3: return [2 /*return*/];
        }
    });
}); };
