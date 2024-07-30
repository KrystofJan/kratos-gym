import { FindWrkOutMachineById, FindAllWrkOutMachines, RecommendMachine, FindOccupiedMachinesOnSpecificTime, CreateWrkOutMachine } from '../Managers/WrkOutMachineManager.js';
import { Request as expressRequest, Response as expressResponse } from 'express';
import { Response } from '../RequestUtility/CustomResponces/Response.js'
import { Account } from '../Models/User.js'
import { Reservation } from '../Models/Reservation.js';
import { ReservationPostModel } from '../Models/PostModels/ReservationPostModel.js';
import { BadRequestResponse } from '../RequestUtility/CustomResponces/BadRequestResponse.js';
import { ReservationGetModel } from '../Models/GetModels/ReservationGetModel.js';
import { OkResponse } from '../RequestUtility/CustomResponces/OkResponse.js';
import { IDictionary } from '../utils/Utilities.js';
import { WrkOutMachine } from '../Models/WrkOutMachine.js';
import { WrkOutMachineParams } from '../RequestUtility/RequestParams/WrkOutMachineParams.js';

export const getWrkOutMachineById = async (req: expressRequest, res: expressResponse, id: number) => {
    const response: Response = await FindWrkOutMachineById(id);
    response.buildResponse(req, res);
}

export const getAllWrkOutMachines = async (req: expressRequest, res: expressResponse) => {
    const response: Response = await FindAllWrkOutMachines();
    response.buildResponse(req, res);
}

export const recommendMachine = async (req: expressRequest, res: expressResponse, id: number) => {
    const response: Response = await RecommendMachine(id);
    response.buildResponse(req, res);
}

export const isOccupied = async (req: expressRequest, res: expressResponse, id: number) => {
    const { time, date } = req.query as WrkOutMachineParams;
    const response: Response = await FindOccupiedMachinesOnSpecificTime(id, time ?? '', date ?? '');

    response.buildResponse(req, res);
}

export const postWrkOutMachine = async (req: expressRequest, res: expressResponse) => {
    const reservation = new WrkOutMachine(req.body);
    let response: Response;

    if (!reservation.validateAttrs()) {
        response = new BadRequestResponse("Unable to create ExerciseType model");
        response.buildResponse(req, res);
        return;
    }
    response = await CreateWrkOutMachine(reservation);
    console.log(response);
    response.buildResponse(req, res);
}
