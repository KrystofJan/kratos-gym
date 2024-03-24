import { RelationalModel } from "./RelationalModel.js";
import { TableTypes } from "../../Database/TableTypes.js";
import { User } from '../../Models/User.js'

export class UserDAO extends RelationalModel{

    constructor() {
        super(TableTypes.User);
    }

    async SelectAllUsers(){
        try{
            const result = this.SelectAll();
            return result;
        }
        catch(err){        
            console.error(err);
        }
    }

    async SelectUserById(id: number){
        try{
            const result = this.SelectById(id);
            return result;
        }
        catch(err){        
            console.error(err);
        }
    }


    async SelectUserByAttribute(attrName: string, attrValue: any){
        try{
            const result = this.SelectByAttr(attrName, attrValue);
            return result;
        }
        catch(error){
            console.log("Nastala chyba: " + error);
        }
    }

    async InsertUser (body: User){
        try{
            const result = this.Insert(body);
            return result;
        }
        catch(err){        
            console.error(err);
        }
    }
}