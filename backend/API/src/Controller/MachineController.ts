import { FindMachineById, FindAllMachines, RecommendMachine, FindOccupiedMachinesOnSpecificTime, CreateMachine } from '../Managers/MachineManager.js';
import { Request as expressRequest, Response as expressResponse } from 'express';
import { Response } from '../RequestUtility/CustomResponces/Response.js'
import { BadRequestResponse } from '../RequestUtility/CustomResponces/BadRequestResponse.js';
import { Machine } from '../Models/Machine.js';
import { MachineParams } from '../RequestUtility/RequestParams/MachineParams.js';
import { MachinePostModel } from '../Models/PostModels/Machine.js';

export const getMachineById = async (req: expressRequest, res: expressResponse, id: number) => {
    const response: Response = await FindMachineById(id);
    response.buildResponse(req, res);
}

export const getAllMachines = async (req: expressRequest, res: expressResponse) => {
    const response: Response = await FindAllMachines();
    response.buildResponse(req, res);
}

export const recommendMachine = async (req: expressRequest, res: expressResponse, id: number) => {
    const response: Response = await RecommendMachine(id);
    response.buildResponse(req, res);
}

export const isOccupied = async (req: expressRequest, res: expressResponse, id: number) => {
    const { time, date } = req.query as MachineParams;
    const response: Response = await FindOccupiedMachinesOnSpecificTime(id, time ?? '', date ?? '');

    response.buildResponse(req, res);
}

export const postMachine = async (req: expressRequest, res: expressResponse) => {
    const reservation = new MachinePostModel(req.body);
    let response: Response;

    if (!reservation.validateAttrs()) {
        response = new BadRequestResponse("Unable to create ExerciseType model");
        response.buildResponse(req, res);
        return;
    }
    response = await CreateMachine(reservation);
    response.buildResponse(req, res);
}
