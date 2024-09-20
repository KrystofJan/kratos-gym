var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ReservationDAO } from '../DataLayer/AccessModels/ReservationDAO.js';
import { Account } from '../Models/Account.js';
import { Reservation } from '../Models/Reservation.js';
import { OkResponse } from '../RequestUtility/CustomResponces/OkResponse.js';
import { CreatedResponse } from '../RequestUtility/CustomResponces/CreatedResponse.js';
import { FailedResponse } from '../RequestUtility/CustomResponces/FailedResponse.js';
import { ReservationGetModel } from '../Models/GetModels/ReservationGetModel.js';
import { AccountDAO } from '../DataLayer/AccessModels/AccountDAO.js';
import { PlanDAO } from '../DataLayer/AccessModels/PlanDAO.js';
import { Plan } from '../Models/Plan.js';
export const FindAllReservations = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reservationDao = new ReservationDAO();
        const accountDao = new AccountDAO();
        const planDAo = new PlanDAO();
        const body = yield reservationDao.SelectAllReservations();
        // validate...
        const results = [];
        for (const b of body) {
            const a = new Reservation(b);
            const customer = yield accountDao.SelectUserById(b.customer_id);
            const trainer = yield accountDao.SelectUserById(b.trainer_id);
            const plan = yield planDAo.SelectPlanById(b.plan_id);
            a.Customer = new Account(customer);
            console.log("esesesekajsdhjakshdkjasfksdhfjsbdcijsdhucbisdcedsuncsiudnfuhshdiunvjsad hiuashdf hhsaidfh jasdfn pusahdf hsadofaoisudfhp;wsdbvoiel fposh fosa dfoas fsa dfasudfhoiaefh ashd fuasof sdfasoijdfh9");
            console.log(a.Customer);
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
});
export const FindReservationById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reservationDao = new ReservationDAO();
        const body = yield reservationDao.SelectReservationById(id);
        const result = new ReservationGetModel(body);
        return new OkResponse("We good", result);
    }
    catch (err) {
        return new FailedResponse("Cannot get any of these things :(", 404);
    }
});
export const CreateReservation = (body) => __awaiter(void 0, void 0, void 0, function* () {
    let result;
    // TODO better response
    try {
        const reservationDao = new ReservationDAO();
        result = yield reservationDao.InsertReservation(body);
        const successResult = result;
        return new CreatedResponse("Successfully created an ExerciseType", successResult.Body);
    }
    catch (err) {
        return new FailedResponse('Sadge', 404);
    }
});
