var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Machine } from '../Models/Machine.js';
import { OkResponse } from '../RequestUtility/CustomResponces/OkResponse.js';
import { CreatedResponse } from '../RequestUtility/CustomResponces/CreatedResponse.js';
import { FailedResponse } from '../RequestUtility/CustomResponces/FailedResponse.js';
import { MachineDAO } from '../DataLayer/AccessModels/MachineDAO.js';
import { PlanMachinesDAO } from '../DataLayer/AccessModels/PlanMachineDAO.js';
import { OccupiedMachinesGetModel } from '../Models/GetModels/OccupiedMachinesGetModel.js';
export const FindAllMachines = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const wrkOutMachineDao = new MachineDAO();
        const body = yield wrkOutMachineDao.SelectAllMachines();
        // validate...
        const results = [];
        for (const b of body) {
            const a = new Machine(b);
            results.push(a);
        }
        return new OkResponse("We good", results);
    }
    catch (err) {
        return new FailedResponse("Cannot get any of these things :(", 404);
    }
});
export const FindMachineById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const wrkOutMachineDao = new MachineDAO();
        const body = yield wrkOutMachineDao.SelectMachineById(id);
        // validate...
        const result = new Machine(body);
        return new OkResponse("We good", result);
    }
    catch (err) {
        return new FailedResponse("Cannot get any of these things :(", 404);
    }
});
export const FindOccupiedMachinesOnSpecificTime = (id, time, date) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const wrkOutPlanMachineDao = new PlanMachinesDAO();
        const body = yield wrkOutPlanMachineDao.SelectOccupiedMachineAmount(id, time, date);
        // validate...
        const result = new OccupiedMachinesGetModel(body);
        return new OkResponse("We good", result);
    }
    catch (err) {
        return new FailedResponse("Cannot get any of these things :(", 404);
    }
});
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
export const CreateMachine = (body) => __awaiter(void 0, void 0, void 0, function* () {
    let result;
    // TODO better response
    try {
        const wrkOutMachineDao = new MachineDAO();
        result = yield wrkOutMachineDao.InsertMachine(body);
        const successResult = result;
        return new CreatedResponse("Successfully created an ExerciseType", successResult.Body);
    }
    catch (err) {
        return new FailedResponse('Sadge', 404);
    }
});
export const RecommendMachine = (id) => __awaiter(void 0, void 0, void 0, function* () {
    let result;
    // TODO better response
    try {
        const wrkOutMachineDao = new MachineDAO();
        result = yield wrkOutMachineDao.RecommendMachine(id);
        const successResult = result;
        return new CreatedResponse("Successfully created an ExerciseType", successResult.Body);
    }
    catch (err) {
        return new FailedResponse('Sadge', 404);
    }
});
