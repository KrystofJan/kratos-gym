const addressService = require('../Services/AddressService');
const addressModel = require('../ORM/Models/Address');

const getAll = async (req, res) => {
    try{
        const address = await addressService.getAll();
        
        // validate...
        const results = [];
        
        for (const b of body){
            const a = new addressModel();
            
            a.constructJson(b);
            results.push(a);
        }
        
        res.status(200).json(results);
    }
    catch(err){
        res.status(500).json(err);
    }
}

const getId = async (req,res,id) => {
    try{
        const address = await addressService.get(id);
        
        const model = new addressModel();
        model.constructFromJson(address);

        res.status(200).json(model.constructJson(address));
    }
    catch(err){
        res.status(500).json(err);
    }
}


const post = async (req, res) => {
    try{
        const body = req.body;
        const result = await addressService.post(body);

        res.status(201).json(result);
    }
    catch(err){
        res.status(500).json(err);
    }
}

module.exports = {
    getAll,
    getId,
    post,
}