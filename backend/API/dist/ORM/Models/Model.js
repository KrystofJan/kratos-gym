var Model = /** @class */ (function () {
    function Model() {
    }
    Model.prototype.cosntructor = function () {
    };
    Model.prototype.constructJson = function () {
        return JSON.parse(JSON.stringify(this));
    };
    Model.prototype.validateAttrs = function () {
        return true;
    };
    return Model;
}());
export { Model };
