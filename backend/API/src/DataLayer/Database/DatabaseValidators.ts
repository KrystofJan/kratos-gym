export class Validators {
    constructor(){
        console.log("preparing validator");
    }
    static validateNumericId(id: number){
        var reg = /^\d+$/;
        // return reg.test(id);
        return true;
    }
}
