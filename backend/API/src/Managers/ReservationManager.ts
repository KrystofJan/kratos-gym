import { ReservationDAO } from '../DataLayer/AccessModels/ReservationDAO.js';
import { Reservation } from '../Models/Reservation.js'
import { Response } from '../RequestUtility/CustomResponces/Response.js';
import { ReservationPostModel } from '../Models/PostModels/ReservationPostModel.js';
import { IDictionary } from '../utils/Utilities.js';
import { OkResponse } from '../RequestUtility/CustomResponces/OkResponse.js';
import { CreatedResponse } from '../RequestUtility/CustomResponces/CreatedResponse.js';
import { FailedResponse } from '../RequestUtility/CustomResponces/FailedResponse.js';
import { DatabaseFail, DatabaseResponse, DatabaseSuccess } from '../DataLayer/Database/DatabaseResponse.js';
import { ReservationGetModel } from '../Models/GetModels/ReservationGetModel.js';


export const FindAllReservations = async (): Promise<Response> => {
    try{
        const reservationDao = new ReservationDAO();
        const body: Array<IDictionary<any>> = await reservationDao.SelectAllReservations();
        
        // validate...
        const results: Array<ReservationGetModel> = [];
        
        for (const b of body){
            const a = new ReservationGetModel(b);

            results.push(a);
        }
        
        return new OkResponse("We good", results);
    }
    catch(err){
        return new FailedResponse("Cannot get any of these things :(");
    }
}

export const FindReservationById = async (id: number): Promise<Response> => {
    try{
        const reservationDao = new ReservationDAO();
        const body: IDictionary<any> = await reservationDao.SelectReservationById(id);
        console.log(body);
        // validate...
        const result = new ReservationGetModel(body);
        
        return new OkResponse("We good", result);
    }
    catch(err){
        return new FailedResponse("Cannot get any of these things :(");
    }
}

export const CreateReservation = async (body: ReservationPostModel): Promise<Response> => {
    let result: DatabaseResponse;
    // TODO better response
    try{
        const reservationDao = new ReservationDAO();
        
        result = await reservationDao.InsertReservation(body);

        const successResult = result as DatabaseSuccess;
        return new CreatedResponse(
            "Successfully created an ExerciseType", 
            successResult.Body);
    }
    catch(err){
        return new FailedResponse('Sadge');
    }
}
