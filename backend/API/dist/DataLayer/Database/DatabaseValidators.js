export class Validators {
    constructor() {
    }
    static validateNumericId(id) {
        var reg = /^\d+$/;
        // return reg.test(id);
        return true;
    }
}
