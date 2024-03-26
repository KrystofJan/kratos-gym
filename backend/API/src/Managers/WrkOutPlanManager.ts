import { WrkOutPlan } from '../Models/WrkOutPlan.js'
import { Response } from '../RequestUtility/CustomResponces/Response.js';
import { IDictionary } from '../utils/Utilities.js';
import { OkResponse } from '../RequestUtility/CustomResponces/OkResponse.js';
import { CreatedResponse } from '../RequestUtility/CustomResponces/CreatedResponse.js';
import { FailedResponse } from '../RequestUtility/CustomResponces/FailedResponse.js';
import { DatabaseResponse, DatabaseSuccess } from '../DataLayer/Database/DatabaseResponse.js';
import { WrkOutPlanDAO } from '../DataLayer/AccessModels/WrkOutPlanDAO.js';

export const FindAllWrkOutPlans = async (): Promise<Response> => {
    try{
        const wrkOutPlanDao = new WrkOutPlanDAO();
        const body: Array<IDictionary<any>> = await wrkOutPlanDao.SelectAllWrkOutPlans();
        
        // validate...
        const results: Array<WrkOutPlan> = [];
        
        for (const b of body){
            const a = new WrkOutPlan(b);

            results.push(a);
        }
        
        return new OkResponse("We good", results);
    }
    catch(err){
        return new FailedResponse("Cannot get any of these things :(");
    }
}

export const FindWrkOutPlanById = async (id: number): Promise<Response> => {
    try{
        const wrkOutPlanDao = new WrkOutPlanDAO();
        const body: IDictionary<any> = await wrkOutPlanDao.SelectWrkOutPlanById(id);
        console.log(body);
        // validate...
        const result = new WrkOutPlan(body);
        
        return new OkResponse("We good", result);
    }
    catch(err){
        return new FailedResponse("Cannot get any of these things :(");
    }
}

export const CreateWrkOutPlan = async (body: WrkOutPlan): Promise<Response> => {
    let result: DatabaseResponse;
    // TODO better response
    try{
        const wrkOutPlanDao = new WrkOutPlanDAO();
        
        result = await wrkOutPlanDao.InsertWrkOutPlan(body);

        const successResult = result as DatabaseSuccess;
        return new CreatedResponse(
            "Successfully created an ExerciseType", 
            successResult.Body);
    }
    catch(err){
        return new FailedResponse('Sadge');
    }
}
