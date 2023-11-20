const dbHandler = require('../../DatabaseHandler');

class Reservation{
    constructor() { }

    constructFromJson(jsonData){
        this.ammountOfPeople = jsonData.AmmountOfPeople;
        this.reservationTime = jsonData.ReservetionTime;
        this.customer = jsonData.Customer;
        this.trainer = jsonData.Trainer;
        this.wrkOutPlan = jsonData.WrkOutPlan;
    }
    
    constructFromData(ammountOfPeople,reservationTime,customer, trainer, wrkOutPlan){
        this.ammountOfPeople = ammountOfPeople;
        this.reservationTime = reservationTime;
        this.customer = customer;
        this.trainer = trainer;
        this.wrkOutPlan = wrkOutPlan;
    }
    
    async getId(res, id){
        try{
            const handler = new dbHandler();
            handler.dbConnect();
            const body = await handler.dbSelectSpecific(res, id,'Reservation');
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
            console.log(body);
            handler.dbDisconnect();
        }
        catch(error){
            console.log("Nastala chyba: " + error);
        }
    }
}
module.exports = Reservation;