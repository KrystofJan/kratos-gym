const reservationService = require('../Services/ReservationService');
const reservationModel = require('../ORM/Models/Reservation');
const userService = require('../Services/UserService');
const userModel = require('../ORM/Models/User');

const getId = async (req,res,id) => {
    try{
        const reservation = await reservationService.getId(id);
        
        const model = new reservationModel();
        
        model.constructFromJson(reservation);
        
        const customerData = await userService.getId(reservation.CustomerId);

        const customer =  new userModel();
        customer.constructFromJson(
            customerData
        );

        model.customer = customer.constructJson();
        

        res.status(200).json(model.constructJson(reservation));
    }
    catch(err){
        res.status(500).json(err);
    }
}

const getAll = async (req,res) => {
    try{
        const reservation = await reservationService.getAll();

        const model = new reservationModel();
        
        const results = [];
        
        for (const b of reservation){
            const a = new reservationModel();
            a.constructFromJson(b);
            const customerData = await userService.getId(b.CustomerId);
            
            const customer =  new userModel();
            customer.constructFromJson(
                customerData
            );

            a.customer = customer.constructJson();

            results.push(a.constructJson(b));
        }

        res.status(200).json(results);
    }
    catch(err){
        res.status(500).json(err);
    }
}

module.exports = {
    getId,
    getAll,
}