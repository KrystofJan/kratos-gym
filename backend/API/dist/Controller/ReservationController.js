var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { FindAllReservations, FindReservationById, CreateReservation } from '../Managers/ReservationManager.js';
import { FindUserById } from '../Managers/UserManager.js';
import { Account } from '../Models/Account.js';
import { Reservation } from '../Models/Reservation.js';
import { ReservationPostModel } from '../Models/PostModels/ReservationPostModel.js';
import { BadRequestResponse } from '../RequestUtility/CustomResponces/BadRequestResponse.js';
import { ReservationGetModel } from '../Models/GetModels/ReservationGetModel.js';
import { OkResponse } from '../RequestUtility/CustomResponces/OkResponse.js';
export const getReservationById = (req, res, id) => __awaiter(void 0, void 0, void 0, function* () {
    let reservation = yield FindReservationById(id);
    if (reservation instanceof OkResponse) {
    }
    if (reservation instanceof OkResponse && reservation.Body.Body instanceof ReservationGetModel) {
        const reservationGetModel = new ReservationGetModel(reservation.Body.Body);
        const customerData = yield FindUserById(reservationGetModel.CustomerId);
        const customer = new Account(customerData);
        const tmp = new Reservation(reservation.Body.Body);
        tmp.Customer = customer;
        reservation.Body.Body = tmp;
    }
    reservation.buildResponse(req, res);
});
export const getAllReservations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let reservations = yield FindAllReservations();
    reservations.buildResponse(req, res);
});
export const postReservation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reservation = new ReservationPostModel(req.body);
    let response;
    if (!reservation.validateAttrs()) {
        response = new BadRequestResponse("Unable to create ExerciseType model");
        response.buildResponse(req, res);
        return;
    }
    response = yield CreateReservation(reservation);
    response.buildResponse(req, res);
});
