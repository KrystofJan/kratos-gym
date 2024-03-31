import { FindAllWrkOutPlans, FindWrkOutPlanById, CreateWrkOutPlan } from '../Managers/WrkOutPlanManager.js';
import { Request as expressRequest, Response as expressResponse } from 'express';
import { Response } from '../RequestUtility/CustomResponces/Response.js';
import { WrkOutPlanPostModel } from '../Models/PostModels/WrkOutPlanPostModel.js';
 

export const getWrkOutPlanById = async (req: expressRequest,res: expressResponse,id: number) => {
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
    const body: WrkOutPlanPostModel = req.body;
    const response: Response = await CreateWrkOutPlan(body);
    response.buildResponse(req, res);
} 
