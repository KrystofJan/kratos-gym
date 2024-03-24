import { WrkOutMachine } from '../Models/WrkOutMachine.js'
import { Response } from '../utils/RequestUtility/CustomResponces/Response.js';
import { IDictionary } from '../utils/Utilities.js';
import { OkResponse } from '../utils/RequestUtility/CustomResponces/OkResponse.js';
import { CreatedResponse } from '../utils/RequestUtility/CustomResponces/CreatedResponse.js';
import { FailedResponse } from '../utils/RequestUtility/CustomResponces/FailedResponse.js';
import { DatabaseResponse, DatabaseSuccess } from '../Database/DatabaseResponse.js';
import { WrkOutMachineDAO } from '../ORM/AccessModels/WrkOutMachineDAO.js';

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
        return new FailedResponse("Cannot get any of these things :(");
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
        return new FailedResponse("Cannot get any of these things :(");
    }
}

export const CreateWrkOutMachine = async (body: WrkOutMachine): Promise<Response> => {
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
        return new FailedResponse('Sadge');
    }
}
