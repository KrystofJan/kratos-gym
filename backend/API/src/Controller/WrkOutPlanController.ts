import { FindAllWrkOutPlans, FindWrkOutPlanById, AddTypeToPlan, FindExerciseTypesContainedInId, FindWrkOutMachinesContainedInId, CreateWrkOutPlan, AddMachineToPlan, AddMultipleMachinesToPlan } from '../Managers/WrkOutPlanManager.js';
import { Request as expressRequest, Response as expressResponse } from 'express';
import { Response } from '../RequestUtility/CustomResponces/Response.js';
import { WrkOutPlanPostModel } from '../Models/PostModels/WrkOutPlanPostModel.js';
import { WrkOutPlanMachinePostModel } from '../Models/PostModels/WrkOutPlanMachinePostModel.js';
import { WrkOutPlanTypePostModel } from '../Models/PostModels/WrkOutPlanTypePostModel.js';

export const getWrkOutPlanById = async (req: expressRequest, res: expressResponse, id: number) => {
    const response: Response = await FindWrkOutPlanById(id);
    response.buildResponse(req, res);
}

export const getAllWrkOutPlans = async (req: expressRequest, res: expressResponse) => {
    const response: Response = await FindAllWrkOutPlans();
    response.buildResponse(req, res);
}

export const postWrkOutPlan = async (req: expressRequest, res: expressResponse) => {
    // if (Array.isArray(req.body)){
    //     const body: Array<WrkOutPlanPostModel> = req.body;

    //     for(const plan of body){

    //     }

    // }
    const body: WrkOutPlanPostModel = new WrkOutPlanPostModel(req.body);
    console.log(body)
    const response: Response = await CreateWrkOutPlan(body);
    response.buildResponse(req, res);
}

export const getMachineByPlanId = async (req: expressRequest, res: expressResponse, id: number) => {
    const response: Response = await FindWrkOutMachinesContainedInId(id);
    response.buildResponse(req, res);
}

const handlePostMultipleMachinesToPlan = async (body: Array<WrkOutPlanMachinePostModel>, id: number): Promise<Response> => {
    for (const record of body) {
        record.wrkoutplan_id = id;
    }

    const response: Response = await AddMultipleMachinesToPlan(body);
    return response;
}

const handlePostSingleMachineToPlan = async (body: WrkOutPlanMachinePostModel, id: number): Promise<Response> => {
    body.wrkoutplan_id = id;
    const response: Response = await AddMachineToPlan(body);
    return response;
}

export const postMachineToPlan = async (req: expressRequest, res: expressResponse, id: number) => {
    let response: Response;

    if (Array.isArray(req.body)) {
        const body: Array<WrkOutPlanMachinePostModel> = []
        for (const b of req.body) {
            body.push(new WrkOutPlanMachinePostModel(b))
        }
        response = await handlePostMultipleMachinesToPlan(body, id)
        response.buildResponse(req, res);
        return;
    }

    const body: WrkOutPlanMachinePostModel = req.body;
    response = await handlePostSingleMachineToPlan(body, id)
    response.buildResponse(req, res);
}


export const postExerciseTypeToPlan = async (req: expressRequest, res: expressResponse, id: number) => {
    const body: WrkOutPlanTypePostModel = req.body;
    body.WrkOutPlanId = id;
    const response = await AddTypeToPlan(body);
    response.buildResponse(req, res);
}

export const getExerciseTypeByPlanId = async (req: expressRequest, res: expressResponse, id: number) => {
    const response: Response = await FindExerciseTypesContainedInId(id);
    response.buildResponse(req, res);
}
