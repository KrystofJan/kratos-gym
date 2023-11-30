const User = require('./User');

class Reservation {

    constructFromJson(jsonData){
        this.reservationId = jsonData.ReservetionId;
        this.ammountOfPeople = jsonData.AmmoutOfPeople;
        this.reservationTime = jsonData.ReservationTime;
        this.customer = jsonData.Customer;
        this.trainer = jsonData.TrainerId;
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
}
module.exports = Reservation;