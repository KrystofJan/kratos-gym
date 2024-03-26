import { FindAllExerciseTypes, FindExerciseTypeById, CreateExerciseType } from '../Managers/ExerciseTypeManager.js';
import { Request as expressRequest, Response as expressResponse } from 'express';
import { Response } from '../RequestUtility/CustomResponces/Response.js'
import { ExerciseType } from '../Models/ExerciseType.js'
import { BadRequestResponse } from '../RequestUtility/CustomResponces/BadRequestResponse.js';

export const getAllExerciseTypes = async (req: expressRequest, res: expressResponse) => {
    const response: Response = await FindAllExerciseTypes();
    response.buildResponse(req, res);
}

export const getExerciseTypeById = async (req: expressRequest, res: expressResponse, id: number) => {
    const response: Response = await FindExerciseTypeById(id);
    response.buildResponse(req, res);
}

export const postExerciseType = async (req: expressRequest, res: expressResponse) => {
    const address = new ExerciseType(req.body);
    let response: Response;
    console.log();
    if (!address.validateAttrs()){
        response = new BadRequestResponse("Unable to create ExerciseType model");
        response.buildResponse(req, res);
        return;
    }
    response = await CreateExerciseType(address);
    console.log(response);
    response.buildResponse(req, res);
}
