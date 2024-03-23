import fs from 'fs';
var ApiLogger = /** @class */ (function () {
    function ApiLogger() {
    }
    ApiLogger.logApi = function (msg) {
        var date = new Date();
        var return_message = "[" + date.toString() + "] - " + msg + "\n";
        fs.appendFile('../../Logs/APIlog.txt', return_message, function (err) {
            if (err) {
                console.error(err);
            }
        });
    };
    ApiLogger.logApiSuccess = function (msg) {
        var date = new Date();
        var return_message = "[" + date.toString() + "] - " + msg + "\n";
        fs.appendFile('../../Logs/APIlog.txt', return_message, function (err) {
            if (err) {
                console.error(err);
            }
        });
    };
    return ApiLogger;
}());
export { ApiLogger };
