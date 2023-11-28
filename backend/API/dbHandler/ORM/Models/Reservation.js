const RelationalModel = require('./RelationalModel');
const User = require('./User');
const UserDAO = require('../AccessModels/UserDAO');

class Reservation extends RelationalModel{

    constructFromJson(jsonData){
        this.reservationId = jsonData.ReservetionId;
        this.ammountOfPeople = jsonData.AmmoutOfPeople;
        this.reservationTime = jsonData.ReservationTime;
        this.customer = jsonData.Customer;
        this.trainer = jsonData.trainerId;
        this.wrkOutPlan = jsonData.WrkOutPlanId;
    }
    
    constructFromData(ammountOfPeople,reservationTime,customer, trainer, wrkOutPlan){
        this.ammountOfPeople = ammountOfPeople;
        this.reservationTime = reservationTime;
        this.customer = customer;
        this.trainer = trainer;
        this.wrkOutPlan = wrkOutPlan;
    }

    constructJson(){
        return{
            "ReservationId": this.reservationId,
            "AmmoutOfPeople": this.ammountOfPeople,
            "ReservationTime": this.reservationTime,
            "Customer": this.customer,
            "TrainerId": (this.trainer)?this.trainer:null,
            "WrkOutPlanId": this.wrkOutPlan
        }
    }
    async getId(res, id, connection){
        try{
            if(connection){
                this.dbHandler.dbConnect();
            }
            
            const body = await this.dbHandler.dbSelectSpecific(res, id,'Reservation');
            // Need this response to call other get requests so that I have this structure:
            /*
                [
                    {
                        "ReservetionId": 2,
                        "AmmoutOfPeople": 2,
                        "ReservationTime": "2023-10-02T13:30:00.000Z",
                        "Customer": {
                            "UserId": 1,
                            ...   
                        },
                        ...
                    }
                ]
            */
            
            const customerData = await new UserDAO().getId(res, id, false);
            const customer =  new User();
            customer.constructFromJson(
                customerData
            );

            this.constructFromJson(body[0]);
            this.customer = customer.constructJson();
            res.json(this.constructJson());
            if(connection){
                dbHandler.dbDisconnect();
            }
            return body[0];
        }
        catch(error){
            console.log("Nastala chyba: " + error);
        }
    }
}
module.exports = Reservation;