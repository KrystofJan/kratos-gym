
class Validators{
    constructor(){
        console.log("preparing validator");
    }
    static validateNumericId(id){
        var reg = /^\d+$/;
        return reg.test(id);
    }
}

module.exports = Validators;