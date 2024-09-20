var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import postgres from 'postgres';
import dotenv from "dotenv";
import { DatabaseSuccess, DatabaseFail } from './DatabaseResponse.js';
import { logger } from '../../utils/logger.js';
dotenv.config();
let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;
export class Database {
    constructor() {
        this.sql = postgres({
            host: PGHOST,
            database: PGDATABASE,
            username: PGUSER,
            password: PGPASSWORD,
            port: 5432,
            ssl: 'require',
            connection: {
                options: `project=${ENDPOINT_ID}`,
            },
        });
    }
    SelectAll(modelType_1) {
        return __awaiter(this, arguments, void 0, function* (modelType, limit = 10, page = 0) {
            const tableName = Reflect.getMetadata('tableName', modelType);
            if (limit < 0 || page < 0) {
                throw new DatabaseFail(new Error("Wrong page or limit value "));
            }
            try {
                const offset = limit * page;
                const result = yield this.sql `Select * from ${this.sql(tableName)} limit ${limit} offset ${offset}`;
                logger.info(`Select all from ${tableName} table was successful\n${JSON.stringify(result, null, 4)}`);
                return new DatabaseSuccess(result);
            }
            catch (error) {
                logger.error(error);
                throw new DatabaseFail(error);
            }
        });
    }
    SelectSpecific(modelType_1, id_1) {
        return __awaiter(this, arguments, void 0, function* (modelType, id, limit = 10, page = 0) {
            const tableName = Reflect.getMetadata('tableName', modelType);
            let pkey = Reflect.getMetadata('primaryKey', modelType);
            try {
                const [result] = yield this.sql `Select * from ${this.sql(tableName)} where ${this.sql(pkey)} = ${id}`;
                logger.info(`Select by id from ${tableName} table was successful\n${JSON.stringify(result, null, 4)}`);
                return new DatabaseSuccess(result);
            }
            catch (error) {
                logger.error(error);
                throw new DatabaseFail(error);
            }
        });
    }
    SelectAttrIs(attrValue, attrName, tableName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [result] = yield this.sql `Select * from ${this.sql(tableName)} where ${this.sql(attrName)} = ${attrValue}`;
                logger.info(`Select by attribute from ${tableName} table was successful\n${JSON.stringify(result, null, 4)}`);
                return new DatabaseSuccess(result);
            }
            catch (error) {
                logger.error(error);
                throw new DatabaseFail(error);
            }
        });
    }
    // TODO: Handle duplicates
    Insert(modelType, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const columnMap = Reflect.getMetadata('columnMap', modelType.prototype);
            const tableName = Reflect.getMetadata('tableName', modelType);
            const foreignKeyMap = Reflect.getMetadata("foreignKeyMap", modelType.prototype);
            // Filter out null or undefined values from the body
            const filteredBody = Object.fromEntries(Object.entries(body).filter(([_, value]) => value != null));
            const columns = Object.keys(filteredBody);
            logger.info(body);
            let processedData = {};
            try {
                for (const column of columns) {
                    const columnMapped = columnMap[column];
                    // Handle foreign key mapping
                    if (foreignKeyMap === null || foreignKeyMap === void 0 ? void 0 : foreignKeyMap[columnMapped]) {
                        const [_, fkPrototype] = foreignKeyMap[columnMapped];
                        const foreignKey = Reflect.getMetadata('primaryKey', fkPrototype);
                        const fieldMap = Reflect.getMetadata('fieldMap', fkPrototype.prototype);
                        processedData[columnMapped] = filteredBody[column][fieldMap[foreignKey]];
                    }
                    else {
                        // Handle boolean conversion
                        processedData[columnMapped] = typeof filteredBody[column] === "boolean"
                            ? Number(filteredBody[column]).toString()
                            : filteredBody[column];
                    }
                }
            }
            catch (error) {
                logger.error(error);
                throw new Error("Error processing body data.");
            }
            const columnNames = Object.keys(processedData);
            try {
                const [result] = yield this.sql `insert into ${this.sql(tableName)} ${this.sql(processedData, columnNames)} returning *`;
                logger.info(`Insert into ${tableName} was successful\n${JSON.stringify(result, null, 4)}`);
                return new DatabaseSuccess(result);
            }
            catch (error) {
                logger.error(error);
                throw new DatabaseFail(error);
            }
        });
    }
    // TODO: change the rest to reflect the rest
    // TODO: CanDisturb if its not free,!!!
    dbSelectOccupiedMachineAmount(id, time, date) {
        return new Promise((resolve, reject) => {
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
    }
    dbRecommendMachine(id) {
        return new Promise((resolve, reject) => {
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
    }
}
