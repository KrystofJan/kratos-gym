import { UserDAO } from '../DataLayer/AccessModels/UserDAO.js';
import { User } from '../Models/User.js'
import { Response } from '../RequestUtility/CustomResponces/Response.js';
import { IDictionary } from '../utils/Utilities.js';
import { OkResponse } from '../RequestUtility/CustomResponces/OkResponse.js';
import { CreatedResponse } from '../RequestUtility/CustomResponces/CreatedResponse.js';
import { FailedResponse } from '../RequestUtility/CustomResponces/FailedResponse.js';
import { DatabaseFail, DatabaseResponse, DatabaseSuccess } from '../DataLayer/Database/DatabaseResponse.js';


export const FindAllUsers = async (): Promise<Response> => {
    try{
        const userDao = new UserDAO();
        const body: Array<IDictionary<any>> = await userDao.SelectAllUsers();
        
        // validate...
        const results: Array<User> = [];
        for (const b of body){
            const a = new User(b);

            results.push(a);
        }
        
        return new OkResponse("We good", results);
    }
    catch(err){
        return new FailedResponse("Cannot get any of these things :(");
    }
}

export const FindUserById = async (id: number): Promise<Response> => {
    try{
        const userDao = new UserDAO();
        const body: IDictionary<any> = await userDao.SelectUserById(id);
        console.log(body);
        
        // validate...
        const result = new User(body);
        
        return new OkResponse("We good", result);
    }
    catch(err){
        return new FailedResponse("Cannot get any of these things :(");
    }
}

export const CreateUser = async (body: User): Promise<Response> => {
    let result: DatabaseResponse;
    // TODO better response
    try{
        const userDao = new UserDAO();
        
        result = await userDao.InsertUser(body);

        const successResult = result as DatabaseSuccess;
        return new CreatedResponse(
            "Successfully created an ExerciseType", 
            successResult.Body);
    }
    catch(err){
        return new FailedResponse('Sadge');
    }
}
