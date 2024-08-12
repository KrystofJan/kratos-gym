import { Machine } from '../Models/Machine.js'
import { Response } from '../RequestUtility/CustomResponces/Response.js';
import { IDictionary } from '../utils/Utilities.js';
import { OkResponse } from '../RequestUtility/CustomResponces/OkResponse.js';
import { CreatedResponse } from '../RequestUtility/CustomResponces/CreatedResponse.js';
import { FailedResponse } from '../RequestUtility/CustomResponces/FailedResponse.js';
import { DatabaseResponse, DatabaseSuccess } from '../DataLayer/Database/DatabaseResponse.js';
import { MachineDAO } from '../DataLayer/AccessModels/MachineDAO.js';
import { MachinePostModel } from '../Models/PostModels/Machine.js';
import { PlanMachinesDAO } from '../DataLayer/AccessModels/PlanMachineDAO.js';
import { OccupiedMachinesGetModel } from '../Models/GetModels/OccupiedMachinesGetModel.js';

export const FindAllMachines = async (): Promise<Response> => {
    try {
        const wrkOutMachineDao = new MachineDAO();
        const body: Array<IDictionary<any>> = await wrkOutMachineDao.SelectAllMachines();

        // validate...
        const results: Array<Machine> = [];

        for (const b of body) {
            const a = new Machine(b);

            results.push(a);
        }

        return new OkResponse("We good", results);
    }
    catch (err) {
        return new FailedResponse("Cannot get any of these things :(", 404);
    }
}

export const FindMachineById = async (id: number): Promise<Response> => {
    try {
        const wrkOutMachineDao = new MachineDAO();
        const body: IDictionary<any> = await wrkOutMachineDao.SelectMachineById(id);

        // validate...
        const result = new Machine(body);

        return new OkResponse("We good", result);
    }
    catch (err) {
        return new FailedResponse("Cannot get any of these things :(", 404);
    }
}

export const FindOccupiedMachinesOnSpecificTime = async (id: number, time: string, date: string): Promise<Response> => {
    try {
        const wrkOutPlanMachineDao = new PlanMachinesDAO();
        const body: IDictionary<number> = await wrkOutPlanMachineDao.SelectOccupiedMachineAmount(id, time, date);

        // validate...
        const result = new OccupiedMachinesGetModel(body);

        return new OkResponse("We good", result);
    }
    catch (err) {
        return new FailedResponse("Cannot get any of these things :(", 404);
    }
}



// TODO: Probably dont even need this tbh
// export const FindMachinesByPlanId = async (id: number) => {
//     try {
//         const wrkOutPlanMachineDao = new PlanMachinesDAO();

//         const body: Array<WrkoutPlanMachineGetModel> = await wrkOutPlanMachineDao.SelectPlanBy_PlanId(id);


//         const result: Array<PlanMachine> = [];

//         for(const machineBody of body) {
//             const wrkOutMachinesDAO = new MachineDAO();
//             const machineData = await wrkOutMachinesDAO.SelectMachineById(machineBody.MachineId);
//             const wrkOutMachine = new Machine(machineData);
//             const wrkOutPlanMachine = new PlanMachine(machineBody);
//             wrkOutPlanMachine.Machine = wrkOutMachine;

//             if (wrkOutPlanMachine.validateAttrs()){
//                 result.push(wrkOutPlanMachine);
//             }
//         }

//         return new OkResponse("We good", result);
//     }
//     catch(err){
//         return new FailedResponse("Cannot get any of these things :(", 404);
//     }
// }


export const CreateMachine = async (body: MachinePostModel): Promise<Response> => {
    let result: DatabaseResponse;
    // TODO better response
    try {
        const wrkOutMachineDao = new MachineDAO();

        result = await wrkOutMachineDao.InsertMachine(body);

        const successResult = result as DatabaseSuccess;
        return new CreatedResponse(
            "Successfully created an ExerciseType",
            successResult.Body);
    }
    catch (err) {
        return new FailedResponse('Sadge', 404);
    }
}

export const RecommendMachine = async (id: number) => {
    let result: DatabaseResponse;
    // TODO better response
    try {
        const wrkOutMachineDao = new MachineDAO();

        result = await wrkOutMachineDao.RecommendMachine(id);

        const successResult = result as DatabaseSuccess;
        return new CreatedResponse(
            "Successfully created an ExerciseType",
            successResult.Body);
    }
    catch (err) {
        return new FailedResponse('Sadge', 404);
    }
}
