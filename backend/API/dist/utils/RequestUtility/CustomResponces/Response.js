export var StatusCodeType;
(function (StatusCodeType) {
    StatusCodeType[StatusCodeType["OK"] = 200] = "OK";
    StatusCodeType[StatusCodeType["CREATED"] = 201] = "CREATED";
    StatusCodeType[StatusCodeType["ACCEPTED"] = 202] = "ACCEPTED";
    StatusCodeType[StatusCodeType["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    StatusCodeType[StatusCodeType["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    StatusCodeType[StatusCodeType["NOT_FOUND"] = 404] = "NOT_FOUND";
    StatusCodeType[StatusCodeType["REQUEST_TIMEOUT"] = 408] = "REQUEST_TIMEOUT";
    StatusCodeType[StatusCodeType["GATEWAY_TIMEOUT"] = 504] = "GATEWAY_TIMEOUT";
    StatusCodeType[StatusCodeType["INTERNAL_SERVER_ERROR"] = 501] = "INTERNAL_SERVER_ERROR";
    StatusCodeType[StatusCodeType["NOT_IMPLEMENTED"] = 502] = "NOT_IMPLEMENTED";
})(StatusCodeType || (StatusCodeType = {}));
