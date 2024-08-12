var Validators = /** @class */ (function () {
    function Validators() {
    }
    Validators.validateNumericId = function (id) {
        var reg = /^\d+$/;
        // return reg.test(id);
        return true;
    };
    return Validators;
}());
export { Validators };
