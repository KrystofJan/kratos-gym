const addressService = require('../Services/AddressService');
const addressModel = require('../ORM/Models/Address');

const getAll = async (req, res) => {
    try{
        const body = await addressService.getAll();
        
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

module.exports = {
    getAll,
}