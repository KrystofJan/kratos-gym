import {FindAllReservations, FindReservationById, CreateReservation } from '../Managers/ReservationManager.js';
import { FindUserById, FindAllUsers } from '../Managers/UserManager.js';
import { Request as expressRequest, Response as expressResponse } from 'express';
import { Response } from '../RequestUtility/CustomResponces/Response.js'
import { User } from '../Models/User.js'
import { Reservation } from '../Models/Reservation.js';
import { ReservationPostModel } from '../Models/PostModels/ReservationPostModel.js';
import { BadRequestResponse } from '../RequestUtility/CustomResponces/BadRequestResponse.js';
import { ReservationGetModel } from '../Models/GetModels/ReservationGetModel.js';
import { OkResponse } from '../RequestUtility/CustomResponces/OkResponse.js';
import { IDictionary } from '../utils/Utilities.js';

export const getReservationById = async (req: expressRequest,res: expressResponse,id: number) => {
    let reservation = await FindReservationById(id);
    if(reservation instanceof OkResponse){
        console.log(reservation.Body.Body);
    }

    if (reservation instanceof OkResponse && reservation.Body.Body instanceof ReservationGetModel){
        console.log('asdasd');
        const reservationGetModel = new ReservationGetModel(reservation.Body.Body);
        const customerData = await FindUserById(reservationGetModel.CustomerId);        
        const customer =  new User(customerData);
        const tmp = new Reservation(reservation.Body.Body);
        tmp.Customer = customer;
        reservation.Body.Body = tmp;
        console.log(reservation.Body.Body);
    }        
    reservation.buildResponse(req, res);
}

export const getAllReservations = async (req: expressRequest,res: expressResponse) => {
    let reservations = await FindAllReservations();

    if (reservations instanceof OkResponse && Array.isArray(reservations.Body.Body)){
        for(let i = 0; i < reservations.Body.Body.length; i++ ){
            let reservation = reservations.Body.Body[i]
            console.log('res',reservation);
            const reservationGetModel = new ReservationGetModel(reservation);
            const customerData = await FindUserById(reservationGetModel.CustomerId);
            const customer =  new User(customerData);
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
    
    if (!reservation.validateAttrs()){
        response = new BadRequestResponse("Unable to create ExerciseType model");
        response.buildResponse(req, res);
        return;
    }
    response = await CreateReservation(reservation);
    console.log(response);
    response.buildResponse(req, res);
}

