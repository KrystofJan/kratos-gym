import { FindAllPlans, FindPlanById, AddTypeToPlan, FindExerciseTypesContainedInId, FindMachinesContainedInId, CreatePlan, AddMachineToPlan, AddMultipleMachinesToPlan } from '../Managers/PlanManager.js';
import { Request as expressRequest, Response as expressResponse } from 'express';
import { Response } from '../RequestUtility/CustomResponces/Response.js';
import { PlanMachinePostModel } from '../Models/PostModels/PlanMachinePostModel.js';
import { PlanTypePostModel } from '../Models/PostModels/PlanTypePostModel.js';
import { Plan } from '../Models/Plan.js';

export const getPlanById = async (req: expressRequest, res: expressResponse, id: number) => {
    const response: Response = await FindPlanById(id);
    response.buildResponse(req, res);
}

export const getAllPlans = async (req: expressRequest, res: expressResponse) => {
    const response: Response = await FindAllPlans();
    response.buildResponse(req, res);
}

export const postPlan = async (req: expressRequest, res: expressResponse) => {
    // if (Array.isArray(req.body)){
    //     const body: Array<PlanPostModel> = req.body;

    //     for(const plan of body){

    //     }

    // }
    const body = new Plan(req.body);
    const response: Response = await CreatePlan(body);
    response.buildResponse(req, res);
}

export const getMachineByPlanId = async (req: expressRequest, res: expressResponse, id: number) => {
    const response: Response = await FindMachinesContainedInId(id);
    response.buildResponse(req, res);
}

const handlePostMultipleMachinesToPlan = async (body: Array<PlanMachinePostModel>, id: number): Promise<Response> => {
    for (const record of body) {
        record.wrkoutplan_id = id;
    }

    const response: Response = await AddMultipleMachinesToPlan(body);
    return response;
}

const handlePostSingleMachineToPlan = async (body: PlanMachinePostModel, id: number): Promise<Response> => {
    body.wrkoutplan_id = id;
    const response: Response = await AddMachineToPlan(body);
    return response;
}

export const postMachineToPlan = async (req: expressRequest, res: expressResponse, id: number) => {
    let response: Response;

    if (Array.isArray(req.body)) {
        const body: Array<PlanMachinePostModel> = []
        for (const b of req.body) {
            body.push(new PlanMachinePostModel(b))
        }
        response = await handlePostMultipleMachinesToPlan(body, id)
    }
    else {

        const body: PlanMachinePostModel = req.body;
        response = await handlePostSingleMachineToPlan(body, id)
    }


    response.buildResponse(req, res);
}


export const postExerciseTypeToPlan = async (req: expressRequest, res: expressResponse, id: number) => {
    const body: PlanTypePostModel = req.body;
    body.plan_id = id;
    const response = await AddTypeToPlan(body);
    response.buildResponse(req, res);
}

export const getExerciseTypeByPlanId = async (req: expressRequest, res: expressResponse, id: number) => {
    const response: Response = await FindExerciseTypesContainedInId(id);
    response.buildResponse(req, res);
}
