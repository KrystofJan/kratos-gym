var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
import postgres from 'postgres';
import dotenv from "dotenv";
import * as dbKeys from '../keys/table-keys.json' with { type: "json" };
import { DatabaseSuccess, DatabaseFail } from './DatabaseResponse.js';
import { logger } from '../../utils/logger.js';
dotenv.config();
var _a = process.env, PGHOST = _a.PGHOST, PGDATABASE = _a.PGDATABASE, PGUSER = _a.PGUSER, PGPASSWORD = _a.PGPASSWORD, ENDPOINT_ID = _a.ENDPOINT_ID;
var Database = /** @class */ (function () {
    function Database() {
        this.sql = postgres({
            host: PGHOST,
            database: PGDATABASE,
            username: PGUSER,
            password: PGPASSWORD,
            port: 5432,
            ssl: 'require',
            connection: {
                options: "project=".concat(ENDPOINT_ID),
            },
        });
        this.tableKeys = JSON.parse(JSON.stringify(dbKeys.default));
    }
    Database.prototype.SelectAll = function (tableName) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.sql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Select * from ", ""], ["Select * from ", ""])), this.sql(tableName))];
                    case 1:
                        result = _a.sent();
                        logger.info("Select all was successful");
                        return [2 /*return*/, new DatabaseSuccess(result)];
                    case 2:
                        error_1 = _a.sent();
                        logger.error(error_1);
                        throw new DatabaseFail(error_1);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Database.prototype.SelectSpecific = function (id, tableName, foreignTable) {
        return __awaiter(this, void 0, void 0, function () {
            var pkey, result, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pkey = this.tableKeys[tableName];
                        if (foreignTable != null) {
                            pkey = this.tableKeys[foreignTable];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.sql(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Select * from ", " where ", " = ", ""], ["Select * from ", " where ", " = ", ""])), this.sql(tableName), this.sql(pkey), id)];
                    case 2:
                        result = (_a.sent())[0];
                        logger.info("Select specific was successful");
                        return [2 /*return*/, new DatabaseSuccess(result)];
                    case 3:
                        error_2 = _a.sent();
                        logger.error(error_2);
                        throw new DatabaseFail(error_2);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Database.prototype.SelectAttrIs = function (attrValue, attrName, tableName) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.sql(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Select * from ", " where ", " = ", ""], ["Select * from ", " where ", " = ", ""])), this.sql(tableName), this.sql(attrName), attrValue)];
                    case 1:
                        result = (_a.sent())[0];
                        logger.info("Select by attr was successful");
                        return [2 /*return*/, new DatabaseSuccess(result)];
                    case 2:
                        error_3 = _a.sent();
                        logger.error(error_3);
                        throw new DatabaseFail(error_3);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // TODO: Handle duplicates
    Database.prototype.Insert = function (body, tableName) {
        return __awaiter(this, void 0, void 0, function () {
            var bodVal, columns, res, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        bodVal = Object.fromEntries(Object.entries(body).filter(function (_a) {
                            var _ = _a[0], v = _a[1];
                            return v != null;
                        }));
                        columns = Object.keys(bodVal);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.sql(templateObject_4 || (templateObject_4 = __makeTemplateObject(["insert into ", " ", " returning *"], ["insert into ", " ", " returning *"])), this.sql(tableName), this.sql(body, columns))];
                    case 2:
                        res = (_a.sent())[0];
                        logger.info("Select by attr was successful");
                        return [2 /*return*/, new DatabaseSuccess(res)];
                    case 3:
                        error_4 = _a.sent();
                        console.error("Error executing query:", error_4);
                        logger.error(error_4);
                        throw new DatabaseFail(error_4);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // TODO: change the rest to reflect the rest
    // TODO: CanDisturb if its not free,!!!
    Database.prototype.dbSelectOccupiedMachineAmount = function (id, time, date) {
        return new Promise(function (resolve, reject) {
            if (id === 3) {
                reject(new DatabaseFail(new Error("asdasdasd")));
            }
            resolve(new DatabaseSuccess({ "All": "good" }));
        });
        // const pkey = dbKeys.default["WrkOutPlanMachines--plan"];
        //
        // if (!Validators.validateNumericId(id)) {
        //     console.error('Cannot use this ID', id);
        //     ApiLogger.logApi("Cannot use this" + pkey + " ! --" + id);
        //     reject({ error: 'Cannot pass in id that\'s not a number! Id: ' + id });
        // }
        // this.db.query(
        //     "select count(*) as count " +
        //     "from WrkOutPlanMachines inner join Reservation on Reservation.WrkOutPlanId = WrkOutPlanMachines.WrkOutPlanId " +
        //     "where ('" + time + "' between WrkOutStartTime and WrkOutEndTime) and Date(ReservationTime) = '" + date + "' " +
        //     "and WrkOutPlanMachines.WrkOutMachineId = " + id + " and WrkOutPlanMachines.canDisturb = 1"
        //     , (err, results) => {
        //         if (err) {
        //             console.error('Error querying the database:', err);
        //             ApiLogger.logApi(err.toString());
        //             reject({ error: 'Internal Server Error' });
        //         }
        //
        //         ApiLogger.logApi("Get request on the Reservations endpoint was Successfull!");
        //         resolve(new DatabaseSuccess(results));
        //     });
    };
    Database.prototype.dbRecommendMachine = function (id) {
        return new Promise(function (resolve, reject) {
            if (id === 3) {
                reject(new DatabaseFail(new Error("asdasdasd")));
            }
            resolve(new DatabaseSuccess({ "All": "good" }));
            // const pkey = dbKeys.default["WrkOutMachine"];
            //
            // if (!Validators.validateNumericId(id)) {
            //     console.error('Cannot use this ID', id);
            //     ApiLogger.logApi("Cannot use this" + pkey + " ! --" + id);
            //     reject({ error: 'Cannot pass in id that\'s not a number! Id: ' + id });
            // }
            // this.db.query(
            //     'SELECT wm.WrkOutMachineId, wm.MachineName, ET.ExerciseTypeName, ET.BodyPart, wm.PopularityScore ' +
            //     'FROM WrkOutMachine wm inner join MachineExerciseTypes met on wm.WrkOutMachineId = met.WrkOutMachineId ' +
            //     'inner join ExerciseType ET on met.ExerciseTypeId = ET.ExerciseTypeId ' +
            //     'Where ET.BodyPart in ( ' +
            //     'select  DISTINCT BodyPart ' +
            //     'from MachineExerciseTypes met inner join ExerciseType ET on met.ExerciseTypeId = ET.ExerciseTypeId ' +
            //     'where met.WrkOutMachineId = ' + id + ') ' +
            //     'and ET.Category in ( ' +
            //     'select Category ' +
            //     'From MachineExerciseTypes met inner join ExerciseType ET on met.ExerciseTypeId = ET.ExerciseTypeId ' +
            //     'Where met.WrkOutMachineId = ' + id + ') ' +
            //     'and wm.WrkOutMachineId != ' + id + ' ' +
            //     'order by wm.PopularityScore desc ' +
            //     'LIMIT 5'
            //     , (err, results) => {
            //         if (err) {
            //             console.error('Error querying the database:', err);
            //             ApiLogger.logApi(err.toString());
            //             reject({ error: 'Internal Server Error' });
            //         }
            //
            //         ApiLogger.logApi("Get request on the Reservations endpoint was Successfull!");
            //         resolve(results);
            //     });
        });
    };
    return Database;
}());
export { Database };
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
