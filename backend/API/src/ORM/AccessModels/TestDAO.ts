import { RelationalModel } from './RelationalModel.js';
import { TableTypes } from "../../utils/ORMUtility/TableTypes.js";

export class TestDAO extends RelationalModel{

    async getId(id: number){

        try{
            const result = await this.MakeDbRequest(
                () => this.dbHandler.dbSelectSpecific(id,TableTypes.test)
            );
            return result[0];
        }
        catch(error){
            console.log("Nastala chyba: " + error);
        }
    }

    async getAll(){
        try{
            console.log("popo");

            const result = await this.MakeDbRequest(
                () => this.dbHandler.dbSelectAll(TableTypes.test)
            );
            return result;
        }
        catch(error){
            console.log("Nastala chyba: " + error);
        }
    }

    async post(body: object){
        try{
            const result = await this.MakeDbRequest(
                () => this.dbHandler.dbPost(body,TableTypes.test)
            );
            
            return result;
        }
        catch(error){
            console.log("Nastala chyba: " + error);
        }
    }
}
