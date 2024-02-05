const dbHandler = require('../Database/Database');
const NoTableExcp = require('../../../../Exceptions/NoTableSelectedError');

class RelationalModel{

    constructor(){
        this.dbHandler = new dbHandler();
    }
    
    async MakeDbRequest(func){
        this.dbHandler.dbConnect();
        const result = await func();
        this.dbHandler.dbDisconnect();
        return result;
    }
}

module.exports = RelationalModel;
