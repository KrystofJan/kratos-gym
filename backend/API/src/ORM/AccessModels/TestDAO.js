const RelationalModel = require('./RelationalModel');

class TestDAO extends RelationalModel{

    async getId(id){

        try{
            const result = await this.MakeDbRequest(() => this.dbHandler.dbSelectSpecific(id,"test"));
            return result[0];
        }
        catch(error){
            console.log("Nastala chyba: " + error);
        }
    }

    async getAll(){
        try{
            console.log("popo");

            const result = await this.MakeDbRequest(() => this.dbHandler.dbSelectAll("test"));
            return result;
        }
        catch(error){
            console.log("Nastala chyba: " + error);
        }
    }

    async post(body){
        try{
            const result = await this.MakeDbRequest(() => this.dbHandler.dbPost(body,"test"));
            
            return result;
        }
        catch(error){
            console.log("Nastala chyba: " + error);
        }
    }
}
module.exports = TestDAO;