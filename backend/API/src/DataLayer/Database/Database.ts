import postgres from 'postgres';
import dotenv from "dotenv";
import * as dbKeys from '../keys/table-keys.json' with {type: "json"};
import { IDictionary } from '../../utils/Utilities.js';
import { DatabaseResponse, DatabaseSuccess, DatabaseFail } from './DatabaseResponse.js';
import { Model } from '../../Models/Model.js';
import Pino from 'pino'

dotenv.config();

let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;
const logger = Pino.pino()

export class Database {

    public sql = postgres({
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

    tableKeys: IDictionary<string>;

    constructor() {
        this.tableKeys = JSON.parse(JSON.stringify(dbKeys.default));
    }

    async SelectAll(tableName: string) {
        try {
            const result: Model[] = await this.sql<Model[]>`Select * from ${this.sql(tableName)}`;
            logger.info("Select all was successful")
            return new DatabaseSuccess(result);
        } catch (error) {
            console.error("Error executing query:", error);
            logger.error(error)
            return new DatabaseFail(error as Error)
        }
    }

    async SelectSpecific(id: number, tableName: string, foreignTable: string | null): Promise<DatabaseResponse> {

        let pkey: string = this.tableKeys[tableName];
        if (foreignTable != null) {
            pkey = this.tableKeys[foreignTable];
        }
        try {
            const [result]: Model[] = await this.sql<Model[]>`Select * from ${this.sql(tableName)} where ${this.sql(pkey)} = ${id}`;
            logger.info("Select specific was successful")
            return new DatabaseSuccess(result);
        } catch (error) {
            console.error("Error executing query:", error);

            logger.error(error)
            return new DatabaseFail(error as Error)
        }
    }

    async SelectAttrIs(attrValue: any, attrName: string, tableName: string): Promise<DatabaseResponse> {
        try {
            const [result]: Model[] = await this.sql<Model[]>`Select * from ${this.sql(tableName)} where ${this.sql(attrName)} = ${attrValue}`;
            logger.info("Select by attr was successful")
            return new DatabaseSuccess(result);
        } catch (error) {
            console.error("Error executing query:", error);
            logger.error(error)
            return new DatabaseFail(error as Error)
        }
    }

    // TODO: Handle duplicates
    async Insert(body: IDictionary<any>, tableName: string): Promise<DatabaseResponse> {
        const bodVal = Object.fromEntries(Object.entries(body).filter(([_, v]) => v != null));
        const columns: string[] = Object.keys(bodVal)

        try {
            const [res] = await this.sql`insert into ${this.sql(tableName)} ${this.sql(body, columns)} returning *`
            logger.info("Select by attr was successful")
            return new DatabaseSuccess(res);
        } catch (error) {
            console.error("Error executing query:", error);
            logger.error(error)
            return new DatabaseFail(error as Error)
        }
    }


    // TODO: change the rest to reflect the rest

    // TODO: CanDisturb if its not free,!!!
    dbSelectOccupiedMachineAmount(id: number, time: string, date: string): Promise<DatabaseResponse> {
        return new Promise((resolve, reject) => {
            if (id === 3) {
                reject(new DatabaseFail(new Error("asdasdasd")))
            }
            resolve(new DatabaseSuccess({ "All": "good" }))
        })
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


    dbRecommendMachine(id: number): Promise<DatabaseResponse> {
        return new Promise((resolve, reject) => {
            if (id === 3) {
                reject(new DatabaseFail(new Error("asdasdasd")))
            }
            resolve(new DatabaseSuccess({ "All": "good" }))
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
