import { FindAllExerciseTypes, FindExerciseTypeById, CreateExerciseType } from '../Managers/ExerciseTypeManager.js';
import { Request as expressRequest, Response as expressResponse } from 'express';
import { Response } from '../utils/RequestUtility/CustomResponces/Response.js'
import { ExerciseType } from '../ORM/Models/ExerciseType.js'
import { BadRequestResponse } from '../utils/RequestUtility/CustomResponces/BadRequestResponse.js';

export const getAllExerciseTypes = async (req: expressRequest, res: expressResponse) => {
    const response: Response = await FindAllExerciseTypes();
    res.status(response.StatusCode).json(response.Body);
}

export const getExerciseTypeById = async (req: expressRequest, res: expressResponse, id: number) => {
    const response: Response = await FindExerciseTypeById(id);
    res.status(response.StatusCode).json(response.Body);
}

export const postExerciseType = async (req: expressRequest, res: expressResponse) => {
    const address = new ExerciseType(req.body);
    let response: Response;
    console.log();
    if (!address.validateAttrs()){
        response = new BadRequestResponse("Unable to create ExerciseType model");
        res.status(response.StatusCode).json(response.Body);
        return;
    }
    response = await CreateExerciseType(address);
    console.log(response);
    res.status(response.StatusCode).json(response.Body);
}
