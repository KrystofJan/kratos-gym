var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { FindExerciseTypeById } from "./ExerciseTypeManager.js";
import { FindMachineById } from "./MachineManager.js";
import { MachineExerciseTypes } from '../Models/MachineExerciseTypes.js';
import { MachineExerciseTypesDAO } from '../DataLayer/AccessModels/MachineExerciseTypesDAO.js';
import { OkResponse } from '../RequestUtility/CustomResponces/OkResponse.js';
import { CreatedResponse } from '../RequestUtility/CustomResponces/CreatedResponse.js';
import { FailedResponse } from '../RequestUtility/CustomResponces/FailedResponse.js';
// TODO change MachineExerciseTypePostModel to GetModel
const buildBody = (machineType) => __awaiter(void 0, void 0, void 0, function* () {
    let result = new Array;
    for (const mt of machineType) {
        const machineBody = yield FindMachineById(mt.MachineId);
        const typeBody = yield FindExerciseTypeById(mt.ExerciseTypeId);
        let tmp = {};
        const machineSuccess = machineBody;
        tmp["Machine"] = machineSuccess.Body.Body;
        const typeSuccess = typeBody;
        tmp["ExerciseType"] = typeSuccess.Body.Body;
        const model = new MachineExerciseTypes(tmp);
        result.push(model);
    }
    return result;
});
export const FindMachineExerciteTypeByMachineId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const machineTypesDAO = new MachineExerciseTypesDAO();
        const machineType = yield machineTypesDAO.SelectMachineExerciseTypesBy_MachineId(id);
        const body = yield buildBody(machineType);
        return new OkResponse("We good", body);
    }
    catch (err) {
        return new FailedResponse(`Cannot get this types ids machine types: ${id}`, 404);
    }
});
export const FindMachineExerciteTypeByExerciseTypeId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const machineTypesDAO = new MachineExerciseTypesDAO();
        const machineType = yield machineTypesDAO.SelectMachineExerciseTypesBy_MachineId(id);
        const body = yield buildBody(machineType);
        return new OkResponse("We good", body);
    }
    catch (err) {
        return new FailedResponse(`Cannot get this types ids machine types: ${id}`, 404);
    }
});
export const CreateMachineExerciseType = (body) => __awaiter(void 0, void 0, void 0, function* () {
    let result;
    try {
        const exerciseTypeDAO = new MachineExerciseTypesDAO();
        result = yield exerciseTypeDAO.InsertMachineExerciseTypes(body);
        const successResult = result;
        return new CreatedResponse("Successfully created an ExerciseType", successResult.Body);
    }
    catch (err) {
        return new FailedResponse('Sadge', 404);
    }
});
