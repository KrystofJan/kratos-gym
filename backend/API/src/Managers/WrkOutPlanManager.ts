import { WrkOutPlan } from '../Models/WrkOutPlan.js'
import { WrkOutPlanPostModel } from '../Models/PostModels/WrkOutPlanPostModel.js';
import { Response } from '../RequestUtility/CustomResponces/Response.js';
import { IDictionary } from '../utils/Utilities.js';
import { OkResponse } from '../RequestUtility/CustomResponces/OkResponse.js';
import { CreatedResponse } from '../RequestUtility/CustomResponces/CreatedResponse.js';
import { FailedResponse } from '../RequestUtility/CustomResponces/FailedResponse.js';
import { DatabaseResponse, DatabaseSuccess } from '../DataLayer/Database/DatabaseResponse.js';
import { WrkOutPlanDAO } from '../DataLayer/AccessModels/WrkOutPlanDAO.js';
import { UserDAO } from '../DataLayer/AccessModels/UserDAO.js';
import { WrkoutPlanGetModel } from '../Models/GetModels/WrkOutPlanGetModel.js';
import { User } from '../Models/User.js';

export const FindAllWrkOutPlans = async (): Promise<Response> => {
    try{
        const wrkOutPlanDao = new WrkOutPlanDAO();
        const body: Array<WrkoutPlanGetModel> = await wrkOutPlanDao.SelectAllWrkOutPlans();
        

        // validate...
        const results: Array<WrkOutPlan> = [];

        for (const b of body){
            const userDao = new UserDAO();
            const userData = await userDao.SelectUserById(b.UserId);
            const user: User = new User(userData);
            const a = new WrkOutPlan(b);
            a.User = user;
            results.push(a);
        }

        return new OkResponse("We good", results);
    }
    catch(err){
        return new FailedResponse("Cannot get any of these things :(", 404);
    }
}

export const FindWrkOutPlanById = async (id: number): Promise<Response> => {
    try {
        const wrkOutPlanDao = new WrkOutPlanDAO();
        const body: WrkoutPlanGetModel = await wrkOutPlanDao.SelectWrkOutPlanById(id);
        const userDao = new UserDAO(); 

        // validate...
        const userData = await userDao.SelectUserById(body.UserId);
        const user: User = new User(userData);
        
        const result = new WrkOutPlan(body);
        result.User = user;
        return new OkResponse("We good", result);
    }
    catch(err){
        return new FailedResponse("Cannot get any of these things :(", 404);
    }
}

export const CreateWrkOutPlan = async (body: WrkOutPlanPostModel): Promise<Response> => {
    let result: DatabaseResponse;

    try {
        const wrkOutPlanDao = new WrkOutPlanDAO();

        result = await wrkOutPlanDao.InsertWrkOutPlan(body);

        const successResult = result as DatabaseSuccess;
        return new CreatedResponse(
            "Successfully created an ExerciseType", 
            successResult.Body);
    }
    catch(err){
        return new FailedResponse('Sadge', 404);
    }
}
