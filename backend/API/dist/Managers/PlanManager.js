var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Plan } from '../Models/Plan.js';
import { OkResponse } from '../RequestUtility/CustomResponces/OkResponse.js';
import { CreatedResponse, CreatedMultipleResponse } from '../RequestUtility/CustomResponces/CreatedResponse.js';
import { FailedResponse } from '../RequestUtility/CustomResponces/FailedResponse.js';
import { PlanDAO } from '../DataLayer/AccessModels/PlanDAO.js';
import { AccountDAO } from '../DataLayer/AccessModels/AccountDAO.js';
import { PlanMachinesDAO } from '../DataLayer/AccessModels/PlanMachineDAO.js';
import { PlanTypeDAO } from '../DataLayer/AccessModels/PlanTypeDAO.js';
import { Account } from '../Models/Account.js';
export const FindAllPlans = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const planDao = new PlanDAO();
        const body = yield planDao.SelectAllPlans();
        // validate...
        const results = [];
        for (const b of body) {
            const a = new Plan(b);
            const userDao = new AccountDAO();
            const userData = yield userDao.SelectUserById(b.account_id);
            const user = new Account(userData);
            a.User = user;
            results.push(a);
        }
        return new OkResponse("We good", results);
    }
    catch (err) {
        return new FailedResponse("Cannot get any of these things :(", 404);
    }
});
export const FindPlanById = (id) => __awaiter(void 0, void 0, void 0, function* () {
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
});
export const FindMachinesContainedInId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const wrkOutPlanMachineDao = new PlanMachinesDAO();
        // const body: Array<PlanMachine> = await wrkOutPlanMachineDao.SelectPlanBy_PlanId(id);
        const result = [];
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
});
export const FindExerciseTypesContainedInId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const wrkOutPlanTypeDAO = new PlanTypeDAO();
        const body = yield wrkOutPlanTypeDAO.SelectPlanTypeBy_PlanId(id);
        ;
        const result = [];
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
});
export const AddMachineToPlan = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const wrkOutPlanMachineDao = new PlanMachinesDAO();
        const result = yield wrkOutPlanMachineDao.InsertPlanMachine(body);
        const successResult = result;
        return new CreatedResponse("We good", successResult.Body);
    }
    catch (err) {
        return new FailedResponse("Cannot get any of these things :(", 404);
    }
});
export const AddMultipleMachinesToPlan = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const createdIds = [];
        for (const machine of body) {
            const wrkOutPlanMachineDao = new PlanMachinesDAO();
            const result = yield wrkOutPlanMachineDao.InsertPlanMachine(machine);
            const successResult = result;
            createdIds.push(successResult.Body);
        }
        return new CreatedMultipleResponse("We good", createdIds);
    }
    catch (err) {
        return new FailedResponse("Cannot get any of these things :(", 404);
    }
});
export const AddTypeToPlan = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const wrkOutPlanTypeDAO = new PlanTypeDAO();
        const result = yield wrkOutPlanTypeDAO.Insertpe(body);
        const successResult = result;
        return new CreatedResponse("Successfully created an ExerciseType", successResult.Body);
    }
    catch (err) {
        return new FailedResponse("Cannot get any of these things :(", 404);
    }
});
export const CreatePlan = (body) => __awaiter(void 0, void 0, void 0, function* () {
    let result;
    try {
        const wrkOutPlanDao = new PlanDAO();
        result = yield wrkOutPlanDao.InsertPlan(body);
        const successResult = result;
        return new CreatedResponse("Successfully created an ExerciseType", successResult.Body);
    }
    catch (err) {
        return new FailedResponse('Sadge', 404);
    }
});
