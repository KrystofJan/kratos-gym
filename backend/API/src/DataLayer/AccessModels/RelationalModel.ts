import { IDictionary } from '../../utils/Utilities.js';
import { Database } from '../Database/Database.js';
import { DatabaseFail, DatabaseResponse, DatabaseSuccess } from '../Database/DatabaseResponse.js';
import { TableTypes } from "../Database/TableTypes.js";
import { Model } from '../../Models/Model.js';
import { SimpleDatabaseRequest } from '../Database/DatabaseRequests/SingleDatabaseRequest.js';

export class RelationalModel {

    protected dbHandler: Database;
    protected TableType: TableTypes;

    constructor(tableType: TableTypes) {
        this.dbHandler = new Database();
        this.TableType = tableType;
    }

    protected async SecectByForeignId(id: number, foreignTableType: TableTypes) {
        try {
            const simpleDatabseRequest: SimpleDatabaseRequest = new SimpleDatabaseRequest(
                () => this.dbHandler.dbSelectSpecific(id, this.TableType, foreignTableType)
            );
            const result: DatabaseResponse = await simpleDatabseRequest.execute();

            if (result instanceof DatabaseSuccess) {
                const successResult = result as DatabaseSuccess;
                return successResult.Body;
            }
        }
        catch (err) {
            if (err instanceof DatabaseFail) {
                return err;
            }
            else {
                console.error(err);
                throw err;
            }
        }
    }

    protected async SelectAll() {
        try {
            const simpleDatabseRequest: SimpleDatabaseRequest = new SimpleDatabaseRequest(
                () => this.dbHandler.dbSelectAll(this.TableType)
            );

            const result: DatabaseResponse = await simpleDatabseRequest.execute();

            if (result instanceof DatabaseSuccess) {
                const successResult = result as DatabaseSuccess;
                return successResult.Body;
            }
        }
        catch (err) {
            if (err instanceof DatabaseFail) {
                return err;
            }
            else {
                console.error(err);
                throw err;
            }
        }
    }

    protected async SelectById(id: number) {
        try {
            const simpleDatabaseRequest: SimpleDatabaseRequest = new SimpleDatabaseRequest(

                () => this.dbHandler.dbSelectSpecific(id, this.TableType, null)
            )
            const result = await simpleDatabaseRequest.execute();

            if (result instanceof DatabaseSuccess) {
                const successResult = result as DatabaseSuccess;
                return successResult.Body[0];
            }
        }
        catch (err) {
            if (err instanceof DatabaseFail) {
                return err;
            }
            else {
                console.error(err);
                throw err;
            }
        }
    }

    protected async SelectByAttr(attrName: string, attrValue: any) {

        try {
            const simpleDatabaseRequest: SimpleDatabaseRequest = new SimpleDatabaseRequest(

                () => this.dbHandler.dbSelectAttrIs(attrValue, attrName, this.TableType)
            )
            const result = await simpleDatabaseRequest.execute();

            if (result instanceof DatabaseSuccess) {
                const successResult = result as DatabaseSuccess;
                return successResult.Body;
            }
        }
        catch (err) {
            if (err instanceof DatabaseFail) {
                return err;
            }
            else {
                console.error(err);
                throw err;
            }
        }
    }

    protected async Insert(body: Model) {
        try {
            const simpleDatabaseRequest: SimpleDatabaseRequest = new SimpleDatabaseRequest(
                () => this.dbHandler.dbPost(body, this.TableType)
            )
            const result = await simpleDatabaseRequest.execute();
            return result;
        }
        catch (err) {
            if (err instanceof DatabaseFail) {
                return err;
            }
            else {
                console.error(err);
                throw err;
            }
        }
    }
}

