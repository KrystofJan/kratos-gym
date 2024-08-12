export class Validators {
    constructor() {
    }
    static validateNumericId(id: number) {
        var reg = /^\d+$/;
        // return reg.test(id);
        return true;
    }
}
