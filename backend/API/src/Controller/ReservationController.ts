import { FindAllReservations, FindReservationById, CreateReservation } from '../Managers/ReservationManager.js';
import { FindUserById, FindAllUsers } from '../Managers/UserManager.js';
import { Request as expressRequest, Response as expressResponse } from 'express';
import { Response } from '../RequestUtility/CustomResponces/Response.js'
import { User } from '../Models/ResponseModels/User.js'
import { Reservation } from '../Models/ResponseModels/Reservation.js';
import { ReservationPostModel } from '../Models/PostModels/ReservationPostModel.js';
import { BadRequestResponse } from '../RequestUtility/CustomResponces/BadRequestResponse.js';
import { ReservationGetModel } from '../Models/GetModels/ReservationGetModel.js';
import { OkResponse } from '../RequestUtility/CustomResponces/OkResponse.js';
import { IDictionary } from '../utils/Utilities.js';

export const getReservationById = async (req: expressRequest, res: expressResponse, id: number) => {
    let reservation = await FindReservationById(id);
    if (reservation instanceof OkResponse) {
    }

    if (reservation instanceof OkResponse && reservation.Body.Body instanceof ReservationGetModel) {
        const reservationGetModel = new ReservationGetModel(reservation.Body.Body);
        const customerData = await FindUserById(reservationGetModel.CustomerId);
        const customer = new User(customerData);
        const tmp = new Reservation(reservation.Body.Body);
        tmp.Customer = customer;
        reservation.Body.Body = tmp;
    }
    reservation.buildResponse(req, res);
}

export const getAllReservations = async (req: expressRequest, res: expressResponse) => {
    let reservations = await FindAllReservations();

    if (reservations instanceof OkResponse && Array.isArray(reservations.Body.Body)) {
        for (let i = 0; i < reservations.Body.Body.length; i++) {
            let reservation = reservations.Body.Body[i]
            const reservationGetModel = new ReservationGetModel(reservation);
            const customerData = await FindUserById(reservationGetModel.CustomerId);
            const customer = new User(customerData);
            const tmp = new Reservation(reservation);
            tmp.Customer = customer;

            reservations.Body.Body[i] = tmp;
        }
    }
    reservations.buildResponse(req, res);
}

export const postReservation = async (req: expressRequest, res: expressResponse) => {
    const reservation = new ReservationPostModel(req.body);
    let response: Response;

    if (!reservation.validateAttrs()) {
        response = new BadRequestResponse("Unable to create ExerciseType model");
        response.buildResponse(req, res);
        return;
    }
    response = await CreateReservation(reservation);
    response.buildResponse(req, res);
}

