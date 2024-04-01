import mysql, { Connection, OkPacket, ResultSetHeader } from 'mysql2';
import * as config  from '../../Config/config.json' with {type: "json"};
import * as dbKeys from '../keys/table-keys.json' with {type: "json"};
import { Validators } from './DatabaseValidators.js'
import { ApiLogger } from '../../Logger/ApiLogger.js';
import { IDictionary } from '../../utils/Utilities.js';
import { DatabaseResponse, DatabaseSuccess, DatabaseFail } from './DatabaseResponse.js';


// TODO: singleton
export class Database {

    db: Connection;
    tableKeys: IDictionary<string>;

    constructor(){
        this.db = mysql.createConnection(config.default.Database);
        this.tableKeys = JSON.parse(JSON.stringify(dbKeys.default));
    }
    
    dbConnect(){
        this.db.connect((err) => {
            if(err){
                ApiLogger.logApi("an error occured while trying to connect to the database!\nError: "+ err);
            }
        });
    }

    dbDisconnect(){
        this.db.end((err) => {
            if(err){
                ApiLogger.logApi("an error occured while trying to disconnectiong to the database!\nError: "+ err);
            }
        });
    }

    dbSelectAll(tableName: string): Promise<DatabaseResponse>{
        return new Promise((resolve, reject) => {
            const command = `SELECT * FROM ${tableName}`;

            this.db.query(command, (err, results) => {
                if (err) {
                  console.error('Error querying the database:', err);
                  ApiLogger.logApi(err.toString());
                  reject(new DatabaseFail(err));
                }
            
                ApiLogger.logApi("Get request on the Reservations endpoint was Successfull!");
                resolve(new DatabaseSuccess(results));
            });
        })
    }

    // TODO: Handle duplicates
    dbPost(body: IDictionary<any>, tableName: string): Promise<DatabaseResponse>{
        return new Promise((resolve, reject) => {
            let data: Array<IDictionary<any>> = [];
            const columns: string = Object.keys(body).join(', ');
            const placeholders: string = Object.keys(body).map(() => '?').join(', ');
    
            Object.keys(body).forEach(function(key: string) {
                data.push(body[key]);
            });
    
            const command = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`;
    
            this.db.query<ResultSetHeader>(command, data, (err, results) => {
                if (err) {
                  console.error('Error querying the database:', err);
                  ApiLogger.logApi(err.toString());
                  reject(new DatabaseFail(err));
                }
                ApiLogger.logApi("Get request on the Reservations endpoint was Successfull!");
                
                const rerere = new DatabaseSuccess(results.insertId);
                console.log(rerere)
                resolve(rerere);
            });
        });
    }

    dbSelectAttrIs(attrValue: any, attrName: string, tableName: string): Promise<DatabaseResponse>{
        return new Promise((resolve, reject) => {
            const command = `Select * from ${tableName} where ${attrName} = '${attrValue}'`;

            this.db.query(command, (err, results) => {
                if (err) {
                    console.error('Error querying the database:', err);
                    ApiLogger.logApi(err.toString());
                    reject(new DatabaseFail(err));
                  }
  
                  ApiLogger.logApi("Get request on the " + tableName +" endpoint was Successfull!");
                  resolve(new DatabaseSuccess(results));
            })
        });
    }

    // TODO: change the rest to reflect the rest
    dbSelectSpecific(id: number, tableName: string, foreignTable: string | null) {
        return new Promise((resolve, reject) => {
            
            let pkey: string = this.tableKeys[tableName];
            if(foreignTable != null){
               pkey = this.tableKeys[foreignTable]; 
            }

            if(!Validators.validateNumericId(id)){
                console.error('Cannot use this ID', id);
                ApiLogger.logApi("Cannot use this"+ pkey + " ! --" + id);
                reject({ error: 'Cannot pass in id that\'s not a number! Id: '+ id });
            }

            const command = `SELECT * FROM ${tableName} WHERE ${pkey} = ${id}`
    
            this.db.query(command, (err, results) => {
                if (err) {
                  console.error('Error querying the database:', err);
                  ApiLogger.logApi(err.toString());
                  reject(new DatabaseFail(err));
                }

                ApiLogger.logApi("Get request on the " + tableName +" endpoint was Successfull!");
                resolve(new DatabaseSuccess(results));
            });
            
        })
    }

    // TODO: CanDisturb if its not free,!!!
    dbSelectOccupiedMachineAmount(id: number, time: string, date: string){
        return new Promise ( (resolve, reject) => {
            const pkey = dbKeys.default["WrkOutPlanMachines--plan"];

            if(!Validators.validateNumericId(id)){
                console.error('Cannot use this ID', id);
                ApiLogger.logApi("Cannot use this"+ pkey + " ! --" + id);
                reject({ error: 'Cannot pass in id that\'s not a number! Id: '+ id });
            }
            this.db.query(
            "select count(*) as count "+
            "from WrkOutPlanMachines inner join Reservation on Reservation.WrkOutPlanId = WrkOutPlanMachines.WrkOutPlanId "+
            "where ('" + time + "' between WrkOutStartTime and WrkOutEndTime) and Date(ReservationTime) = '" + date + "' " +
            "and WrkOutPlanMachines.WrkOutMachineId = " + id + " and WrkOutPlanMachines.canDisturb = 1"
            ,(err, results) => {
                if (err) {
                  console.error('Error querying the database:', err);
                  ApiLogger.logApi(err.toString());
                  reject({ error: 'Internal Server Error' });
                }
    
                ApiLogger.logApi("Get request on the Reservations endpoint was Successfull!");
                resolve(new DatabaseSuccess(results));
            });
        });            
    }


    dbRecommendMachine(id: number){
        return new Promise ( (resolve, reject) => {
            const pkey = dbKeys.default["WrkOutMachine"];

            if(!Validators.validateNumericId(id)){
                console.error('Cannot use this ID', id);
                ApiLogger.logApi("Cannot use this"+ pkey + " ! --" + id);
                reject({ error: 'Cannot pass in id that\'s not a number! Id: '+ id });
            }
            this.db.query(
            'SELECT wm.WrkOutMachineId, wm.MachineName, ET.ExerciseTypeName, ET.BodyPart, wm.PopularityScore '+
            'FROM WrkOutMachine wm inner join MachineExerciseTypes met on wm.WrkOutMachineId = met.WrkOutMachineId ' +         
            'inner join ExerciseType ET on met.ExerciseTypeId = ET.ExerciseTypeId ' +
            'Where ET.BodyPart in ( ' +
                'select  DISTINCT BodyPart '+
                'from MachineExerciseTypes met inner join ExerciseType ET on met.ExerciseTypeId = ET.ExerciseTypeId '+
                'where met.WrkOutMachineId = ' + id +') ' +
            'and ET.Category in ( ' +
                'select Category '+
                'From MachineExerciseTypes met inner join ExerciseType ET on met.ExerciseTypeId = ET.ExerciseTypeId '+
                'Where met.WrkOutMachineId = ' + id + ') '+
            'and wm.WrkOutMachineId != ' + id + ' ' +
            'order by wm.PopularityScore desc ' +
            'LIMIT 5'
            ,(err, results) => {
                if (err) {
                  console.error('Error querying the database:', err);
                  ApiLogger.logApi(err.toString());
                  reject({ error: 'Internal Server Error' });
                }
    
                ApiLogger.logApi("Get request on the Reservations endpoint was Successfull!");
                resolve(results);
            });
        });            
    }
}
