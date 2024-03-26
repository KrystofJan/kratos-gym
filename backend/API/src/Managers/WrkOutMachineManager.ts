import { WrkOutMachine } from '../Models/WrkOutMachine.js'
import { Response } from '../RequestUtility/CustomResponces/Response.js';
import { IDictionary } from '../utils/Utilities.js';
import { OkResponse } from '../RequestUtility/CustomResponces/OkResponse.js';
import { CreatedResponse } from '../RequestUtility/CustomResponces/CreatedResponse.js';
import { FailedResponse } from '../RequestUtility/CustomResponces/FailedResponse.js';
import { DatabaseResponse, DatabaseSuccess } from '../DataLayer/Database/DatabaseResponse.js';
import { WrkOutMachineDAO } from '../DataLayer/AccessModels/WrkOutMachineDAO.js';
import { WrkOutMachinePostModel } from '../Models/PostModels/WrkOutMachine.js';

export const FindAllWrkOutMachines = async (): Promise<Response> => {
    try{
        const wrkOutMachineDao = new WrkOutMachineDAO();
        const body: Array<IDictionary<any>> = await wrkOutMachineDao.SelectAllWrkOutMachines();
        
        // validate...
        const results: Array<WrkOutMachine> = [];
        
        for (const b of body){
            const a = new WrkOutMachine(b);

            results.push(a);
        }
        
        return new OkResponse("We good", results);
    }
    catch(err){
        return new FailedResponse("Cannot get any of these things :(", 404);
    }
}

export const FindWrkOutMachineById = async (id: number): Promise<Response> => {
    try{
        const wrkOutMachineDao = new WrkOutMachineDAO();
        const body: IDictionary<any> = await wrkOutMachineDao.SelectWrkOutMachineById(id);

        // validate...
        const result = new WrkOutMachine(body);
        
        return new OkResponse("We good", result);
    }
    catch(err){
        return new FailedResponse("Cannot get any of these things :(", 404);
    }
}

export const CreateWrkOutMachine = async (body: WrkOutMachinePostModel): Promise<Response> => {
    let result: DatabaseResponse;
    // TODO better response
    try{
        const wrkOutMachineDao = new WrkOutMachineDAO();
        
        result = await wrkOutMachineDao.InsertWrkOutMachine(body);

        const successResult = result as DatabaseSuccess;
        return new CreatedResponse(
            "Successfully created an ExerciseType", 
            successResult.Body);
    }
    catch(err){
        return new FailedResponse('Sadge', 404);
    }
}

export const RecommendMachine = async (id: number) => {
    let result: DatabaseResponse;
    // TODO better response
    try{
        const wrkOutMachineDao = new WrkOutMachineDAO();
        
        result = await wrkOutMachineDao.RecommendMachine(id);

        const successResult = result as DatabaseSuccess;
        return new CreatedResponse(
            "Successfully created an ExerciseType", 
            successResult.Body);
    }
    catch(err){
        return new FailedResponse('Sadge', 404);
    }
}
