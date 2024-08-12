import { ExerciseTypeDAO } from './../DataLayer/AccessModels/ExerciseTypeDAO.js';
import { MachineDAO } from './../DataLayer/AccessModels/MachineDAO.js';
import { Plan } from '../Models/Plan.js'
import { Response } from '../RequestUtility/CustomResponces/Response.js';
import { OkResponse } from '../RequestUtility/CustomResponces/OkResponse.js';
import { CreatedResponse, CreatedMultipleResponse } from '../RequestUtility/CustomResponces/CreatedResponse.js';
import { FailedResponse } from '../RequestUtility/CustomResponces/FailedResponse.js';
import { DatabaseResponse, DatabaseSuccess } from '../DataLayer/Database/DatabaseResponse.js';
import { PlanDAO } from '../DataLayer/AccessModels/PlanDAO.js';
import { AccountDAO } from '../DataLayer/AccessModels/AccountDAO.js';
import { PlanMachinesDAO } from '../DataLayer/AccessModels/PlanMachineDAO.js';
import { PlanMachine } from '../Models/PlanMachine.js';
import { PlanMachinePostModel } from '../Models/PostModels/PlanMachinePostModel.js';
import { PlanTypePostModel } from '../Models/PostModels/PlanTypePostModel.js';
import { PlanTypeDAO } from '../DataLayer/AccessModels/PlanTypeDAO.js';
import { PlanType } from '../Models/PlanType.js';
import { ExerciseType } from '../Models/ExerciseType.js';
import { PlanPostModel } from '../Models/PostModels/PlanPostModel.js';
import { Account } from '../Models/Account.js';

export const FindAllPlans = async (): Promise<Response> => {
    try {
        const planDao = new PlanDAO();
        const body = await planDao.SelectAllPlans();

        // validate...
        const results: Array<Plan> = [];

        for (const b of body) {
            const a = new Plan(b);
            const userDao = new AccountDAO();
            const userData = await userDao.SelectUserById(b.account_id);
            const user = new Account(userData);
            a.User = user;
            results.push(a);
        }

        return new OkResponse("We good", results);
    } catch (err) {
        return new FailedResponse("Cannot get any of these things :(", 404);
    }
}

export const FindPlanById = async (id: number): Promise<Response> => {
    try {
        const wrkOutPlanDao = new PlanDAO();
        // const body: Plan = await wrkOutPlanDao.SelectPlanById(id);
        const userDao = new AccountDAO();

        // validate...
        // const userData = await userDao.SelectUserById(body.account_id);
        // const user: Account = new Account(userData);

        const result = new Plan({ "asdasd": "dasd" });
        // result.User = user;
        return new OkResponse("We good", result);
    }
    catch (err) {
        return new FailedResponse("Cannot get any of these things :(", 404);
    }
}

export const FindMachinesContainedInId = async (id: number) => {
    try {
        const wrkOutPlanMachineDao = new PlanMachinesDAO();

        // const body: Array<PlanMachine> = await wrkOutPlanMachineDao.SelectPlanBy_PlanId(id);


        const result: Array<PlanMachine> = [];

        // for (const machineBody of body) {
        //     const wrkOutMachinesDAO = new MachineDAO();
        //     const machineData = await wrkOutMachinesDAO.SelectMachineById(machineBody.machineid);
        //     const wrkOutMachine = new Machine(machineData);
        //     const wrkOutPlanMachine = new PlanMachine(machineBody);
        //     wrkOutPlanMachine.Machine = wrkOutMachine;
        //
        //     if (wrkOutPlanMachine.validateAttrs()) {
        //         result.push(wrkOutPlanMachine);
        //     }
        // }

        return new OkResponse("We good", result);
    }
    catch (err) {
        return new FailedResponse("Cannot get any of these things :(", 404);
    }
}


export const FindExerciseTypesContainedInId = async (id: number) => {
    try {
        const wrkOutPlanTypeDAO = new PlanTypeDAO();

        const body: Array<PlanType> = await wrkOutPlanTypeDAO.SelectPlanTypeBy_PlanId(id);;


        const result: Array<PlanType> = [];

        // for (const typeBody of body) {
        //     const exerciseTypeDAO = new ExerciseTypeDAO();
        //     const typeData = await exerciseTypeDAO.SelectExerciseTypeById(typeBody.ExerciseTypeId);
        //     const exerciseType = new ExerciseType(typeData);
        //     const wrkOutPlanType = new PlanType(typeBody);
        //     wrkOutPlanType.ExerciseType = exerciseType;
        //
        //     if (wrkOutPlanType.validateAttrs()) {
        //         result.push(wrkOutPlanType);
        //     }
        // }

        return new OkResponse("We good", result);
    }
    catch (err) {
        return new FailedResponse("Cannot get any of these things :(", 404);
    }
}


export const AddMachineToPlan = async (body: PlanMachinePostModel) => {
    try {
        const wrkOutPlanMachineDao = new PlanMachinesDAO();

        const result = await wrkOutPlanMachineDao.InsertPlanMachine(body);

        const successResult = result as DatabaseSuccess;
        return new CreatedResponse("We good", successResult.Body);
    }
    catch (err) {
        return new FailedResponse("Cannot get any of these things :(", 404);
    }
}

export const AddMultipleMachinesToPlan = async (body: Array<PlanMachinePostModel>) => {
    try {

        const createdIds: Array<number> = [];

        for (const machine of body) {
            const wrkOutPlanMachineDao = new PlanMachinesDAO();
            const result = await wrkOutPlanMachineDao.InsertPlanMachine(machine);
            const successResult = result as DatabaseSuccess;
            createdIds.push(successResult.Body);
        }

        return new CreatedMultipleResponse("We good", createdIds);
    }
    catch (err) {
        return new FailedResponse("Cannot get any of these things :(", 404);
    }
}

export const AddTypeToPlan = async (body: PlanTypePostModel) => {
    try {
        const wrkOutPlanTypeDAO = new PlanTypeDAO();

        const result: DatabaseResponse = await wrkOutPlanTypeDAO.Insertpe(body);

        const successResult = result as DatabaseSuccess;
        return new CreatedResponse(
            "Successfully created an ExerciseType",
            successResult.Body);
    }
    catch (err) {
        return new FailedResponse("Cannot get any of these things :(", 404);
    }
}


export const CreatePlan = async (body: Plan): Promise<Response> => {
    let result: DatabaseResponse;

    try {
        const wrkOutPlanDao = new PlanDAO();

        result = await wrkOutPlanDao.InsertPlan(body);

        const successResult = result as DatabaseSuccess;
        return new CreatedResponse(
            "Successfully created an ExerciseType",
            successResult.Body);
    }
    catch (err) {
        return new FailedResponse('Sadge', 404);
    }
}
