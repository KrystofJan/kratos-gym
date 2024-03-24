import { RelationalModel } from "./RelationalModel.js";
import { Reservation } from '../../Models/Reservation.js'
import { TableTypes } from "../../Database/TableTypes.js";
import { ReservationPostModel } from '../../Models/PostModels/ReservationPostModel.js';

export class ReservationDAO extends RelationalModel{

    constructor() {
        super(TableTypes.Reservation);
    }

    async SelectAllReservations(){
        try{
            const result = this.SelectAll();
            return result;
        }
        catch(err){        
            console.error(err);
        }
    }

    async SelectReservationById(id: number){
        try{
            const result = this.SelectById(id);
            return result;
        }
        catch(err){        
            console.error(err);
        }
    }

    async InsertReservation (body: ReservationPostModel){
        try{
            const result = this.Insert(body);
            return result;
        }
        catch(err){        
            console.error(err);
        }
    }
}