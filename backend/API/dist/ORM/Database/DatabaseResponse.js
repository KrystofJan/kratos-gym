var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { ResponseStatus } from '../../utils/common/ResponseStatus.js';
// TODO: Dont use any
var DatabaseSuccess = /** @class */ (function () {
    function DatabaseSuccess(body) {
        this.Status = ResponseStatus.SUCCESS;
        this.Body = body;
    }
    return DatabaseSuccess;
}());
export { DatabaseSuccess };
// TODO: Dont use string
var DatabaseFail = /** @class */ (function (_super) {
    __extends(DatabaseFail, _super);
    function DatabaseFail(err) {
        var _this = _super.call(this, err.toString()) || this;
        _this.Status = ResponseStatus.FAIL;
        _this.Error = err;
        _this.ErrorMessage = _this.Error.toString();
        return _this;
    }
    return DatabaseFail;
}(Error));
export { DatabaseFail };
