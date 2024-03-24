import { IDictionary } from "../utils/Utilities.js";
import { MachineExerciseTypePostModel } from "../Models/PostModels/MachineExerciseTypePostModel.js";
import { FindExerciseTypeById } from "./ExerciseTypeManager.js";
import { FindWrkOutMachineById } from "./WrkOutMachineManager.js";
import { WrkOutMachine } from "../Models/WrkOutMachine.js";
import { ExerciseType } from "../Models/ExerciseType.js";
import { MachineExerciseTypes } from '../Models/MachineExerciseTypes.js';
import { MachineExerciseTypeGetModel } from '../Models/GetModels/MachineExerciseTypesGetModel.js'
import { MachineExerciseTypesDAO } from '../ORM/AccessModels/MachineExerciseTypesDAO.js';
import { OkResponse } from '../utils/RequestUtility/CustomResponces/OkResponse.js';
import { CreatedResponse } from '../utils/RequestUtility/CustomResponces/CreatedResponse.js';
import { FailedResponse } from '../utils/RequestUtility/CustomResponces/FailedResponse.js';
import { DatabaseResponse, DatabaseSuccess } from '../Database/DatabaseResponse.js';

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
        console.log(tmp["Machine"]);
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
        return new FailedResponse(`Cannot get this types ids machine types: ${id}`);
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
        return new FailedResponse(`Cannot get this types ids machine types: ${id}`);
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
        return new FailedResponse('Sadge');
    }
}