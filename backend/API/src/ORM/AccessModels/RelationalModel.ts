import { Database } from '../Database/Database.js';

export class RelationalModel{

    protected dbHandler: Database;

    constructor(){
        this.dbHandler = new Database();
    }
    
    protected async MakeDbRequest(func: Function){
        this.dbHandler.dbConnect();
        const result = await func();
        this.dbHandler.dbDisconnect();
        return result;
    }
}

