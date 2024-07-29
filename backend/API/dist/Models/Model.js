var Model = /** @class */ (function () {
    function Model() {
    }
    Model.prototype.cosntructor = function () {
    };
    Model.prototype.constructJson = function () {
        return JSON.parse(JSON.stringify(this));
    };
    // TODO
    Model.prototype.validateAttrs = function () {
        for (var prop in this) {
            if (this[prop] === undefined) {
                return false;
            }
        }
        return true;
    };
    return Model;
}());
export { Model };
