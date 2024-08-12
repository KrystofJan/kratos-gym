import { FindMachineExerciteTypeByExerciseTypeId, FindMachineExerciteTypeByMachineId, CreateMachineExerciseType } from '../Managers/MachineExerciseTypesManager.js';
import { Request as expressRequest, Response as expressResponse } from 'express';
import { Response } from '../RequestUtility/CustomResponces/Response.js'
import { MachineExerciseTypePostModel } from '../Models/PostModels/MachineExerciseTypePostModel.js'
import { BadRequestResponse } from '../RequestUtility/CustomResponces/BadRequestResponse.js';
import { MachineExerciseTypes } from '../Models/MachineExerciseTypes.js';

export const getMachineExerciseTypesByMachineId = async (req: expressRequest, res: expressResponse, id: number) => {
    const response: Response = await FindMachineExerciteTypeByMachineId(id);
    response.buildResponse(req, res);
}

export const getMachineExerciseTypesByExerciseTypeId = async (req: expressRequest, res: expressResponse, id: number) => {
    const response: Response = await FindMachineExerciteTypeByExerciseTypeId(id);
    response.buildResponse(req, res);
}

export const postMachineExerciseTypes = async (req: expressRequest, res: expressResponse) => {
    const machineExerciseType = new MachineExerciseTypePostModel(req.body);
    let response: Response;
    if (!machineExerciseType.validateAttrs()) {
        response = new BadRequestResponse("Unable to create ExerciseType model");
        response.buildResponse(req, res);
        return;
    }
    response = await CreateMachineExerciseType(machineExerciseType);
    response.buildResponse(req, res);
}
