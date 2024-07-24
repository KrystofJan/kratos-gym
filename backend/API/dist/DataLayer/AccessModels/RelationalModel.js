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
import { Database } from '../Database/Database.js';
import { DatabaseFail, DatabaseSuccess } from '../Database/DatabaseResponse.js';
var RelationalModel = /** @class */ (function () {
    function RelationalModel(tableType) {
        this.dbHandler = new Database();
        this.TableType = tableType;
    }
    RelationalModel.prototype.SecectByForeignId = function (id, foreignTableType) {
        return __awaiter(this, void 0, void 0, function () {
            var result, successResult, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.dbHandler.SelectSpecific(id, this.TableType, foreignTableType)];
                    case 1:
                        result = _a.sent();
                        if (result instanceof DatabaseSuccess) {
                            successResult = result;
                            return [2 /*return*/, successResult.Body];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _a.sent();
                        if (err_1 instanceof DatabaseFail) {
                            return [2 /*return*/, err_1];
                        }
                        else {
                            console.error(err_1);
                            throw err_1;
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    RelationalModel.prototype.SelectAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, successResult, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.dbHandler.SelectAll(this.TableType)];
                    case 1:
                        result = _a.sent();
                        if (result instanceof DatabaseSuccess) {
                            successResult = result;
                            return [2 /*return*/, successResult.Body];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_2 = _a.sent();
                        if (err_2 instanceof DatabaseFail) {
                            return [2 /*return*/, err_2];
                        }
                        else {
                            console.error(err_2);
                            throw err_2;
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    RelationalModel.prototype.SelectById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var result, successResult, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.dbHandler.SelectSpecific(id, this.TableType, null)];
                    case 1:
                        result = _a.sent();
                        console.log(result);
                        if (result instanceof DatabaseSuccess) {
                            successResult = result;
                            return [2 /*return*/, successResult.Body];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_3 = _a.sent();
                        if (err_3 instanceof DatabaseFail) {
                            return [2 /*return*/, err_3];
                        }
                        else {
                            console.error(err_3);
                            throw err_3;
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    RelationalModel.prototype.SelectByAttr = function (attrName, attrValue) {
        return __awaiter(this, void 0, void 0, function () {
            var result, successResult, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.dbHandler.SelectAttrIs(attrValue, attrName, this.TableType)];
                    case 1:
                        result = _a.sent();
                        if (result instanceof DatabaseSuccess) {
                            successResult = result;
                            return [2 /*return*/, successResult.Body];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_4 = _a.sent();
                        if (err_4 instanceof DatabaseFail) {
                            return [2 /*return*/, err_4];
                        }
                        else {
                            console.error(err_4);
                            throw err_4;
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    RelationalModel.prototype.Insert = function (body) {
        return __awaiter(this, void 0, void 0, function () {
            var result, err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.dbHandler.Post(body, this.TableType)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                    case 2:
                        err_5 = _a.sent();
                        if (err_5 instanceof DatabaseFail) {
                            return [2 /*return*/, err_5];
                        }
                        else {
                            console.error(err_5);
                            throw err_5;
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return RelationalModel;
}());
export { RelationalModel };
