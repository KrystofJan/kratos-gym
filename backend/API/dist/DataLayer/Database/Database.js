import mysql from 'mysql2';
import * as config from '../../Config/config.json' with { type: "json" };
import * as dbKeys from '../keys/table-keys.json' with { type: "json" };
import { Validators } from './DatabaseValidators.js';
import { ApiLogger } from '../../Logger/ApiLogger.js';
import { DatabaseSuccess, DatabaseFail } from './DatabaseResponse.js';
var Database = /** @class */ (function () {
    function Database() {
        this.tableKeys = JSON.parse(JSON.stringify(dbKeys.default));
    }
    Database.dbConnect = function () {
        // TODO: Investigate if I should switch this to a different approach... maybe dont create connection and end it afterwards
        Database.db = mysql.createConnection(config.default.Database);
        Database.db.connect(function (err) {
            if (err) {
                ApiLogger.logApi("an error occured while trying to connect to the database!\nError: " + err);
            }
        });
    };
    Database.dbDisconnect = function () {
        Database.db.end(function (err) {
            if (err) {
                ApiLogger.logApi("an error occured while trying to disconnectiong to the database!\nError: " + err);
            }
        });
    };
    Database.prototype.dbSelectAll = function (tableName) {
        return new Promise(function (resolve, reject) {
            var command = "SELECT * FROM ".concat(tableName);
            Database.db.query(command, function (err, results) {
                if (err) {
                    console.error('Error querying the database:', err);
                    ApiLogger.logApi(err.toString());
                    reject(new DatabaseFail(err));
                }
                ApiLogger.logApi("Get request on the Reservations endpoint was Successfull!");
                resolve(new DatabaseSuccess(results));
            });
        });
    };
    // TODO: Handle duplicates
    Database.prototype.dbPost = function (body, tableName) {
        return new Promise(function (resolve, reject) {
            var data = [];
            var columns = Object.keys(body).join(', ');
            var placeholders = Object.keys(body).map(function () { return '?'; }).join(', ');
            Object.keys(body).forEach(function (key) {
                data.push(body[key]);
            });
            var command = "INSERT INTO ".concat(tableName, " (").concat(columns, ") VALUES (").concat(placeholders, ")");
            Database.db.query(command, data, function (err, results) {
                if (err) {
                    console.error('Error querying the database:', err);
                    ApiLogger.logApi(err.toString());
                    reject(new DatabaseFail(err));
                }
                ApiLogger.logApi("Get request on the Reservations endpoint was Successfull!");
                var rerere = new DatabaseSuccess(results.insertId);
                resolve(rerere);
            });
        });
    };
    Database.prototype.dbSelectAttrIs = function (attrValue, attrName, tableName) {
        return new Promise(function (resolve, reject) {
            var command = "Select * from ".concat(tableName, " where ").concat(attrName, " = '").concat(attrValue, "'");
            Database.db.query(command, function (err, results) {
                if (err) {
                    console.error('Error querying the database:', err);
                    ApiLogger.logApi(err.toString());
                    reject(new DatabaseFail(err));
                }
                ApiLogger.logApi("Get request on the " + tableName + " endpoint was Successfull!");
                resolve(new DatabaseSuccess(results));
            });
        });
    };
    // TODO: change the rest to reflect the rest
    Database.prototype.dbSelectSpecific = function (id, tableName, foreignTable) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var pkey = _this.tableKeys[tableName];
            if (foreignTable != null) {
                pkey = _this.tableKeys[foreignTable];
            }
            if (!Validators.validateNumericId(id)) {
                console.error('Cannot use this ID', id);
                ApiLogger.logApi("Cannot use this" + pkey + " ! --" + id);
                reject({ error: 'Cannot pass in id that\'s not a number! Id: ' + id });
            }
            var command = "SELECT * FROM ".concat(tableName, " WHERE ").concat(pkey, " = ").concat(id);
            Database.db.query(command, function (err, results) {
                if (err) {
                    console.error('Error querying the database:', err);
                    ApiLogger.logApi(err.toString());
                    reject(new DatabaseFail(err));
                }
                ApiLogger.logApi("Get request on the " + tableName + " endpoint was Successfull!");
                resolve(new DatabaseSuccess(results));
            });
        });
    };
    // TODO: CanDisturb if its not free,!!!
    Database.prototype.dbSelectOccupiedMachineAmount = function (id, time, date) {
        return new Promise(function (resolve, reject) {
            var pkey = dbKeys.default["WrkOutPlanMachines--plan"];
            if (!Validators.validateNumericId(id)) {
                console.error('Cannot use this ID', id);
                ApiLogger.logApi("Cannot use this" + pkey + " ! --" + id);
                reject({ error: 'Cannot pass in id that\'s not a number! Id: ' + id });
            }
            Database.db.query("select count(*) as count " +
                "from WrkOutPlanMachines inner join Reservation on Reservation.WrkOutPlanId = WrkOutPlanMachines.WrkOutPlanId " +
                "where ('" + time + "' between WrkOutStartTime and WrkOutEndTime) and Date(ReservationTime) = '" + date + "' " +
                "and WrkOutPlanMachines.WrkOutMachineId = " + id + " and WrkOutPlanMachines.canDisturb = 1", function (err, results) {
                if (err) {
                    console.error('Error querying the database:', err);
                    ApiLogger.logApi(err.toString());
                    reject({ error: 'Internal Server Error' });
                }
                ApiLogger.logApi("Get request on the Reservations endpoint was Successfull!");
                resolve(new DatabaseSuccess(results));
            });
        });
    };
    Database.prototype.dbRecommendMachine = function (id) {
        return new Promise(function (resolve, reject) {
            var pkey = dbKeys.default["WrkOutMachine"];
            if (!Validators.validateNumericId(id)) {
                console.error('Cannot use this ID', id);
                ApiLogger.logApi("Cannot use this" + pkey + " ! --" + id);
                reject({ error: 'Cannot pass in id that\'s not a number! Id: ' + id });
            }
            Database.db.query('SELECT wm.WrkOutMachineId, wm.MachineName, ET.ExerciseTypeName, ET.BodyPart, wm.PopularityScore ' +
                'FROM WrkOutMachine wm inner join MachineExerciseTypes met on wm.WrkOutMachineId = met.WrkOutMachineId ' +
                'inner join ExerciseType ET on met.ExerciseTypeId = ET.ExerciseTypeId ' +
                'Where ET.BodyPart in ( ' +
                'select  DISTINCT BodyPart ' +
                'from MachineExerciseTypes met inner join ExerciseType ET on met.ExerciseTypeId = ET.ExerciseTypeId ' +
                'where met.WrkOutMachineId = ' + id + ') ' +
                'and ET.Category in ( ' +
                'select Category ' +
                'From MachineExerciseTypes met inner join ExerciseType ET on met.ExerciseTypeId = ET.ExerciseTypeId ' +
                'Where met.WrkOutMachineId = ' + id + ') ' +
                'and wm.WrkOutMachineId != ' + id + ' ' +
                'order by wm.PopularityScore desc ' +
                'LIMIT 5', function (err, results) {
                if (err) {
                    console.error('Error querying the database:', err);
                    ApiLogger.logApi(err.toString());
                    reject({ error: 'Internal Server Error' });
                }
                ApiLogger.logApi("Get request on the Reservations endpoint was Successfull!");
                resolve(results);
            });
        });
    };
    Database.db = mysql.createConnection(config.default.Database);
    return Database;
}());
export { Database };
