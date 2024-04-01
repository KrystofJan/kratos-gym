import { IDictionary } from "../utils/Utilities.js";
import { MachineExerciseTypePostModel } from "../Models/PostModels/MachineExerciseTypePostModel.js";
import { FindExerciseTypeById } from "./ExerciseTypeManager.js";
import { FindWrkOutMachineById } from "./WrkOutMachineManager.js";
import { MachineExerciseTypes } from '../Models/MachineExerciseTypes.js';
import { MachineExerciseTypeGetModel } from '../Models/GetModels/MachineExerciseTypesGetModel.js'
import { MachineExerciseTypesDAO } from '../DataLayer/AccessModels/MachineExerciseTypesDAO.js';
import { OkResponse } from '../RequestUtility/CustomResponces/OkResponse.js';
import { CreatedResponse } from '../RequestUtility/CustomResponces/CreatedResponse.js';
import { FailedResponse } from '../RequestUtility/CustomResponces/FailedResponse.js';
import { DatabaseResponse, DatabaseSuccess } from '../DataLayer/Database/DatabaseResponse.js';

// TODO change MachineExerciseTypePostModel to GetModel
const buildBody = async (machineType: Array<MachineExerciseTypeGetModel>) => {
    let result: Array<MachineExerciseTypes> = new Array<MachineExerciseTypes>;
    for(const mt of machineType){
        const machineBody = await FindWrkOutMachineById(mt.WrkOutMachineId); 
        const typeBody = await FindExerciseTypeById(mt.ExerciseTypeId);



        let tmp: IDictionary<any> = {};

        const machineSuccess = machineBody as OkResponse;
        tmp["Machine"] = machineSuccess.Body.Body;

        const typeSuccess = typeBody as OkResponse;
        tmp["ExerciseType"] = typeSuccess.Body.Body;

        const model = new MachineExerciseTypes(tmp);
        result.push(model);
    }
    return result;
}

export const FindMachineExerciteTypeByWrkOutMachineId = async (id: number) => { // getByMachineId
    try{
        const machineTypesDAO = new MachineExerciseTypesDAO();
        const machineType = await machineTypesDAO.SelectMachineExerciseTypesBy_WrkOutMachineId(id);
        const body: Array<MachineExerciseTypes> = await buildBody(machineType)
        return new OkResponse("We good", body);
    }
    catch(err){
        return new FailedResponse(`Cannot get this types ids machine types: ${id}`, 404);
    }
}

export const FindMachineExerciteTypeByExerciseTypeId = async (id: number) => {
    try{
        const machineTypesDAO = new MachineExerciseTypesDAO();
        const machineType = await machineTypesDAO.SelectMachineExerciseTypesBy_WrkOutMachineId(id);
        const body: Array<MachineExerciseTypes> = await buildBody(machineType)

        return new OkResponse("We good", body);
    }
    catch(err){
        return new FailedResponse(`Cannot get this types ids machine types: ${id}`, 404);
    }
}

export const CreateMachineExerciseType = async (body: MachineExerciseTypePostModel) => {
    let result: DatabaseResponse;

    try{
        const exerciseTypeDAO = new MachineExerciseTypesDAO();
        
        result = await exerciseTypeDAO.InsertMachineExerciseTypes(body);
        const successResult = result as DatabaseSuccess;
        return new CreatedResponse(
            "Successfully created an ExerciseType", 
            successResult.Body);
    }
    catch(err){
        return new FailedResponse('Sadge', 404);
    }
}