import { ExerciseTypeDAO } from '../DataLayer/AccessModels/ExerciseTypeDAO.js';
import { ExerciseType } from '../Models/ExerciseType.js'
import { Response } from '../RequestUtility/CustomResponces/Response.js';
import { IDictionary } from '../utils/Utilities.js';
import { OkResponse } from '../RequestUtility/CustomResponces/OkResponse.js';
import { CreatedResponse } from '../RequestUtility/CustomResponces/CreatedResponse.js';
import { FailedResponse } from '../RequestUtility/CustomResponces/FailedResponse.js';
import { DatabaseFail, DatabaseResponse, DatabaseSuccess } from '../DataLayer/Database/DatabaseResponse.js';


export const FindAllExerciseTypes = async () => {
    try{
        const exerciseTypeDAO = new ExerciseTypeDAO();
        const body: Array<IDictionary<any>> = await exerciseTypeDAO.SelectAllExerciseTypes();
        
        // validate...
        const results: Array<ExerciseType> = [];
        
        for (const b of body){
            const a = new ExerciseType(b);

            results.push(a);
        }
        
        return new OkResponse("We good", results);
    }
    catch(err){
        return new FailedResponse("Cannot get any of these things :(");
    }
}

export const FindExerciseTypeById = async (id: number) => {
    try{
        const exerciseTypeDAO = new ExerciseTypeDAO();
        const body: IDictionary<any> = await exerciseTypeDAO.SelectExerciseTypeById(id);
        
        // validate...
        const result = new ExerciseType(body);
        
        return new OkResponse("We good", result);
    }
    catch(err){
        return new FailedResponse("Cannot get any of these things :(");
    }
}

export const CreateExerciseType = async (body: ExerciseType) => {
    let result: DatabaseResponse;
    // TODO better response
    try{
        const exerciseTypeDAO = new ExerciseTypeDAO();
        
        result = await exerciseTypeDAO.InsertExerciseType(body);
        const successResult = result as DatabaseSuccess;
        return new CreatedResponse(
            "Successfully created an ExerciseType", 
            successResult.Body);
    }
    catch(err){
        return new FailedResponse('Sadge');
    }
}
