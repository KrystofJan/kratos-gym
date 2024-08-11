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
import { FindAllPlans, FindPlanById, AddTypeToPlan, FindExerciseTypesContainedInId, FindMachinesContainedInId, CreatePlan, AddMachineToPlan, AddMultipleMachinesToPlan } from '../Managers/PlanManager.js';
import { PlanPostModel } from '../Models/PostModels/PlanPostModel.js';
import { PlanMachinePostModel } from '../Models/PostModels/PlanMachinePostModel.js';
export var getPlanById = function (req, res, id) { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, FindPlanById(id)];
            case 1:
                response = _a.sent();
                response.buildResponse(req, res);
                return [2 /*return*/];
        }
    });
}); };
export var getAllPlans = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, FindAllPlans()];
            case 1:
                response = _a.sent();
                response.buildResponse(req, res);
                return [2 /*return*/];
        }
    });
}); };
export var postPlan = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var body, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                body = new PlanPostModel(req.body);
                console.log(body);
                return [4 /*yield*/, CreatePlan(body)];
            case 1:
                response = _a.sent();
                response.buildResponse(req, res);
                return [2 /*return*/];
        }
    });
}); };
export var getMachineByPlanId = function (req, res, id) { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, FindMachinesContainedInId(id)];
            case 1:
                response = _a.sent();
                response.buildResponse(req, res);
                return [2 /*return*/];
        }
    });
}); };
var handlePostMultipleMachinesToPlan = function (body, id) { return __awaiter(void 0, void 0, void 0, function () {
    var _i, body_1, record, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                for (_i = 0, body_1 = body; _i < body_1.length; _i++) {
                    record = body_1[_i];
                    record.wrkoutplan_id = id;
                }
                return [4 /*yield*/, AddMultipleMachinesToPlan(body)];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response];
        }
    });
}); };
var handlePostSingleMachineToPlan = function (body, id) { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                body.wrkoutplan_id = id;
                return [4 /*yield*/, AddMachineToPlan(body)];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response];
        }
    });
}); };
export var postMachineToPlan = function (req, res, id) { return __awaiter(void 0, void 0, void 0, function () {
    var response, body, _i, _a, b, body;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!Array.isArray(req.body)) return [3 /*break*/, 2];
                body = [];
                for (_i = 0, _a = req.body; _i < _a.length; _i++) {
                    b = _a[_i];
                    body.push(new PlanMachinePostModel(b));
                }
                return [4 /*yield*/, handlePostMultipleMachinesToPlan(body, id)];
            case 1:
                response = _b.sent();
                return [3 /*break*/, 4];
            case 2:
                body = req.body;
                return [4 /*yield*/, handlePostSingleMachineToPlan(body, id)];
            case 3:
                response = _b.sent();
                _b.label = 4;
            case 4:
                console.log(response);
                response.buildResponse(req, res);
                return [2 /*return*/];
        }
    });
}); };
export var postExerciseTypeToPlan = function (req, res, id) { return __awaiter(void 0, void 0, void 0, function () {
    var body, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                body = req.body;
                body.plan_id = id;
                return [4 /*yield*/, AddTypeToPlan(body)];
            case 1:
                response = _a.sent();
                response.buildResponse(req, res);
                return [2 /*return*/];
        }
    });
}); };
export var getExerciseTypeByPlanId = function (req, res, id) { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, FindExerciseTypesContainedInId(id)];
            case 1:
                response = _a.sent();
                response.buildResponse(req, res);
                return [2 /*return*/];
        }
    });
}); };
