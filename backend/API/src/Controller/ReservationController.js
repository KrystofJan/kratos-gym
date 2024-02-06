const reservationService = require('../Services/ReservationService');
const userService = require('../Services/UserService');
const UserModel = require('../ORM/Models/User');
const ReservationModel = require('../ORM/Models/Reservation');

const getId = async (req,res,id) => {
    try{
        const reservation = await reservationService.getId(id);
        
        const customerData = await userService.getId(reservation.CustomerId);
        const customer =  new UserModel(customerData);

        const model = new ReservationModel(reservation);
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
        
        const results = [];
        
        for (const b of reservation){
            const customerData = await userService.getId(b.CustomerId);
            const customer =  new UserModel(customerData);

            const a = new ReservationModel(b);
            a.customer = customer.constructJson();

            results.push(a.constructJson(b));
        }

        res.status(200).json(results);
    }
    catch(err){
        res.status(500).json(err);
    }
}

const post = async (req, res) => {
    try{
        const body = req.body;
        const result = await reservationService.post(body);

        res.status(201).json(result);
    }
    catch(err){
        res.status(500).json(err);
    }
}

module.exports = {
    getId,
    getAll,
    post,
}