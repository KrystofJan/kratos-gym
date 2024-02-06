const RelationalModel = require('./RelationalModel');

class UserDAO extends RelationalModel{
    async getId(id){

        try{
            const result = await this.MakeDbRequest(() => this.dbHandler.dbSelectSpecific(id,"User"));

            return result[0];
        }
        catch(error){
            console.log("Nastala chyba: " + error);
        }
    }
    
    async getValueIs (attrValue, attrName) {
        try{
            const result = await this.MakeDbRequest(() => this.dbHandler.dbSelectAttrIs(attrValue, attrName, "User"));
            return result;
        }
        catch(error){
            console.log("Nastala chyba: " + error);
        }
    }

    async post (body){
        try{
            const result = await this.MakeDbRequest(() => this.dbHandler.dbPost(body, "User"));
            return result;
        }        
        catch(error){
            console.log("Nastala chyba: " + error);
        }
    }
}
module.exports = UserDAO;