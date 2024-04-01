import { ExerciseTypeDAO } from './../DataLayer/AccessModels/ExerciseTypeDAO.js';
import { WrkOutMachineDAO } from './../DataLayer/AccessModels/WrkOutMachineDAO.js';
import { WrkOutPlan } from '../Models/WrkOutPlan.js'
import { WrkOutPlanPostModel } from '../Models/PostModels/WrkOutPlanPostModel.js';
import { Response } from '../RequestUtility/CustomResponces/Response.js';
import { IDictionary } from '../utils/Utilities.js';
import { OkResponse } from '../RequestUtility/CustomResponces/OkResponse.js';
import { CreatedResponse, CreatedMultipleResponse } from '../RequestUtility/CustomResponces/CreatedResponse.js';
import { FailedResponse } from '../RequestUtility/CustomResponces/FailedResponse.js';
import { DatabaseResponse, DatabaseSuccess } from '../DataLayer/Database/DatabaseResponse.js';
import { WrkOutPlanDAO } from '../DataLayer/AccessModels/WrkOutPlanDAO.js';
import { UserDAO } from '../DataLayer/AccessModels/UserDAO.js';
import { WrkOutPlanMachinesDAO } from '../DataLayer/AccessModels/WrkOutPlanMachineDAO.js';
import { WrkoutPlanGetModel } from '../Models/GetModels/WrkOutPlanGetModel.js';
import { WrkoutPlanMachineGetModel } from '../Models/GetModels/WrkOutPlanMachinesGetModel.js';
import { User } from '../Models/User.js';
import { WrkOutMachine } from '../Models/WrkOutMachine.js';
import { WrkOutPlanMachine } from '../Models/WrkOutPlanMachine.js';
import { WrkOutPlanMachinePostModel } from '../Models/PostModels/WrkOutPlanMachinePostModel.js';
import { WrkOutPlanTypePostModel } from '../Models/PostModels/WrkOutPlanTypePostModel.js';
import { WrkOutPlanTypeDAO } from '../Models/AccessModels/WrkOutPlanTypeDAO.js';
import { WrkOutPlanType } from '../Models/WrkOutPlanType.js';
import { WrkOutPlanTypeGetModel } from '../Models/GetModels/WrkOutPlanTypeGetModel.js';
import { ExerciseType } from '../Models/ExerciseType.js';
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

export const FindWrkOutMachinesContainedInId = async (id: number) => {
    try {
        const wrkOutPlanMachineDao = new WrkOutPlanMachinesDAO();
        
        const body: Array<WrkoutPlanMachineGetModel> = await wrkOutPlanMachineDao.SelectWrkOutPlanBy_WrkOutPlanId(id);
        

        const result: Array<WrkOutPlanMachine> = [];

        for(const machineBody of body) {
            const wrkOutMachinesDAO = new WrkOutMachineDAO();
            const machineData = await wrkOutMachinesDAO.SelectWrkOutMachineById(machineBody.WrkOutMachineId);
            const wrkOutMachine = new WrkOutMachine(machineData);
            const wrkOutPlanMachine = new WrkOutPlanMachine(machineBody);
            wrkOutPlanMachine.WrkOutMachine = wrkOutMachine;

            if (wrkOutPlanMachine.validateAttrs()){
                result.push(wrkOutPlanMachine);
            }
        }

        return new OkResponse("We good", result);
    }
    catch(err){
        return new FailedResponse("Cannot get any of these things :(", 404);
    }
}


export const FindExerciseTypesContainedInId = async (id: number) => {
    try {
        const wrkOutPlanTypeDAO = new WrkOutPlanTypeDAO();
        
        const body: Array<WrkOutPlanTypeGetModel> = await wrkOutPlanTypeDAO.SelectWrkOutPlanTypeBy_WrkOutPlanId(id);;
        

        const result: Array<WrkOutPlanType> = [];

        for(const typeBody of body) {
            const exerciseTypeDAO = new ExerciseTypeDAO();
            const typeData = await exerciseTypeDAO.SelectExerciseTypeById(typeBody.ExerciseTypeId);
            const exerciseType = new ExerciseType(typeData);
            const wrkOutPlanType = new WrkOutPlanType(typeBody);
            wrkOutPlanType.ExerciseType = exerciseType;

            if (wrkOutPlanType.validateAttrs()){
                result.push(wrkOutPlanType);
            }
        }

        return new OkResponse("We good", result);
    }
    catch(err){
        return new FailedResponse("Cannot get any of these things :(", 404);
    }
}


export const AddMachineToPlan = async (body: WrkOutPlanMachinePostModel) => {
    try {
        const wrkOutPlanMachineDao = new WrkOutPlanMachinesDAO();
        
        const result = await wrkOutPlanMachineDao.InsertWrkOutPlanMachine(body);

        const successResult = result as DatabaseSuccess;
        return new CreatedResponse("We good", successResult.Body );
    }
    catch(err){
        return new FailedResponse("Cannot get any of these things :(", 404);
    }
}

export const AddMultipleMachinesToPlan = async (body: Array<WrkOutPlanMachinePostModel>) => {
    try {

        const createdIds: Array<number> = [];

        for(const machine of body){
            const wrkOutPlanMachineDao = new WrkOutPlanMachinesDAO();
            const result = await wrkOutPlanMachineDao.InsertWrkOutPlanMachine(machine);
            const successResult = result as DatabaseSuccess;
            createdIds.push(successResult.Body);
        }            
        
        return new CreatedMultipleResponse("We good", createdIds );
    }
    catch(err){
        return new FailedResponse("Cannot get any of these things :(", 404);
    }
}

export const AddTypeToPlan = async(body: WrkOutPlanTypePostModel) => {
    try {
        const wrkOutPlanTypeDAO = new WrkOutPlanTypeDAO();
        
        const result: DatabaseResponse = await wrkOutPlanTypeDAO.InsertWrkOutPlanType(body);
        

        const successResult = result as DatabaseSuccess;
        return new CreatedResponse(
            "Successfully created an ExerciseType", 
            successResult.Body);
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
