import { ReservationDAO } from '../DataLayer/AccessModels/ReservationDAO.js';
import { Account } from '../Models/Account.js';
import { Reservation } from '../Models/Reservation.js'
import { Response } from '../RequestUtility/CustomResponces/Response.js';
import { ReservationPostModel } from '../Models/PostModels/ReservationPostModel.js';
import { IDictionary } from '../utils/Utilities.js';
import { OkResponse } from '../RequestUtility/CustomResponces/OkResponse.js';
import { CreatedResponse } from '../RequestUtility/CustomResponces/CreatedResponse.js';
import { FailedResponse } from '../RequestUtility/CustomResponces/FailedResponse.js';
import { DatabaseFail, DatabaseResponse, DatabaseSuccess } from '../DataLayer/Database/DatabaseResponse.js';
import { ReservationGetModel } from '../Models/GetModels/ReservationGetModel.js';
import { AccountDAO } from '../DataLayer/AccessModels/AccountDAO.js';
import { PlanDAO } from '../DataLayer/AccessModels/PlanDAO.js';
import { Plan } from '../Models/Plan.js';

export const FindAllReservations = async (): Promise<Response> => {
    try {
        const reservationDao = new ReservationDAO();
        const accountDao = new AccountDAO()
        const planDAo = new PlanDAO()
        const body: Array<IDictionary<any>> = await reservationDao.SelectAllReservations();

        // validate...
        const results: Array<Reservation> = [];

        for (const b of body) {
            const a = new Reservation(b);
            const customer = await accountDao.SelectUserById(b.customer_id)

            const trainer = await accountDao.SelectUserById(b.trainer_id)

            const plan = await planDAo.SelectPlanById(b.plan_id)


            a.Customer = new Account(customer);
            console.log("esesesekajsdhjakshdkjasfksdhfjsbdcijsdhucbisdcedsuncsiudnfuhshdiunvjsad hiuashdf hhsaidfh jasdfn pusahdf hsadofaoisudfhp;wsdbvoiel fposh fosa dfoas fsa dfasudfhoiaefh ashd fuasof sdfasoijdfh9")
            console.log(a.Customer)


            if (trainer) {
                a.Trainer = new Account(trainer);
            }

            a.Plan = new Plan(plan);

            results.push(a);
        }

        return new OkResponse("We good", results);
    }
    catch (err) {
        return new FailedResponse("Cannot get any of these things :(", 404);
    }
}

export const FindReservationById = async (id: number): Promise<Response> => {
    try {
        const reservationDao = new ReservationDAO();
        const body: IDictionary<any> = await reservationDao.SelectReservationById(id);
        const result = new ReservationGetModel(body);

        return new OkResponse("We good", result);
    }
    catch (err) {
        return new FailedResponse("Cannot get any of these things :(", 404);
    }
}

export const CreateReservation = async (body: ReservationPostModel): Promise<Response> => {
    let result: DatabaseResponse;
    // TODO better response
    try {
        const reservationDao = new ReservationDAO();

        result = await reservationDao.InsertReservation(body);

        const successResult = result as DatabaseSuccess;
        return new CreatedResponse(
            "Successfully created an ExerciseType",
            successResult.Body);
    }
    catch (err) {
        return new FailedResponse('Sadge', 404);
    }
}
