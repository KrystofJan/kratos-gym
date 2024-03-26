var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { FindAllReservations, FindReservationById, CreateReservation } from '../Managers/ReservationManager.js';
import { FindUserById } from '../Managers/UserManager.js';
import { User } from '../Models/User.js';
import { Reservation } from '../Models/Reservation.js';
import { ReservationPostModel } from '../Models/PostModels/ReservationPostModel.js';
import { BadRequestResponse } from '../RequestUtility/CustomResponces/BadRequestResponse.js';
import { ReservationGetModel } from '../Models/GetModels/ReservationGetModel.js';
import { OkResponse } from '../RequestUtility/CustomResponces/OkResponse.js';
export var getReservationById = function (req, res, id) { return __awaiter(void 0, void 0, void 0, function () {
    var reservation, reservationGetModel, customerData, customer, tmp;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, FindReservationById(id)];
            case 1:
                reservation = _a.sent();
                if (reservation instanceof OkResponse) {
                    console.log(reservation.Body.Body);
                }
                if (!(reservation instanceof OkResponse && reservation.Body.Body instanceof ReservationGetModel)) return [3 /*break*/, 3];
                console.log('asdasd');
                reservationGetModel = new ReservationGetModel(reservation.Body.Body);
                return [4 /*yield*/, FindUserById(reservationGetModel.CustomerId)];
            case 2:
                customerData = _a.sent();
                customer = new User(customerData);
                tmp = new Reservation(reservation.Body.Body);
                tmp.Customer = customer;
                reservation.Body.Body = tmp;
                console.log(reservation.Body.Body);
                _a.label = 3;
            case 3:
                reservation.buildResponse(req, res);
                return [2 /*return*/];
        }
    });
}); };
export var getAllReservations = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var reservations, i, reservation, reservationGetModel, customerData, customer, tmp;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, FindAllReservations()];
            case 1:
                reservations = _a.sent();
                if (!(reservations instanceof OkResponse && Array.isArray(reservations.Body.Body))) return [3 /*break*/, 5];
                i = 0;
                _a.label = 2;
            case 2:
                if (!(i < reservations.Body.Body.length)) return [3 /*break*/, 5];
                reservation = reservations.Body.Body[i];
                console.log('res', reservation);
                reservationGetModel = new ReservationGetModel(reservation);
                return [4 /*yield*/, FindUserById(reservationGetModel.CustomerId)];
            case 3:
                customerData = _a.sent();
                customer = new User(customerData);
                tmp = new Reservation(reservation);
                tmp.Customer = customer;
                reservations.Body.Body[i] = tmp;
                _a.label = 4;
            case 4:
                i++;
                return [3 /*break*/, 2];
            case 5:
                reservations.buildResponse(req, res);
                return [2 /*return*/];
        }
    });
}); };
export var postReservation = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var reservation, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                reservation = new ReservationPostModel(req.body);
                if (!reservation.validateAttrs()) {
                    response = new BadRequestResponse("Unable to create ExerciseType model");
                    response.buildResponse(req, res);
                    return [2 /*return*/];
                }
                return [4 /*yield*/, CreateReservation(reservation)];
            case 1:
                response = _a.sent();
                console.log(response);
                response.buildResponse(req, res);
                return [2 /*return*/];
        }
    });
}); };
