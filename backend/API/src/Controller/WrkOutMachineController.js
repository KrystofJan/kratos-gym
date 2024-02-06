const wrkOutMachineService = require('../Services/WrkOutMachineService');
const WrkOutMachineModel = require('../ORM/Models/WrkOutMachine');

const getAll = async (req, res) => {
    try{
        const body = await wrkOutMachineService.getAll();

        // validate...
        const results = [];

        for (const b of body){
            const a = new WrkOutMachineModel(b);

            results.push(a.constructJson());
        }
        
        res.status(200).json(results);
    }
    catch(err){
        res.status(500).json(err);
    }
}

const getId = async (req,res,id) => {
    try{
        const body = await wrkOutMachineService.getId(id);
        
        const model = new WrkOutMachineModel(body);
        
        res.status(200).json(model.constructJson());
    }
    catch(err){
        res.status(500).json(err);
    }
}

const recommendMachine = async (req,res,id) => {
    try{
        const body = await wrkOutMachineService.recommendMachine(id);

        const result = [];
        for (const b of body){
            const model = new WrkOutMachineModel(b);
            result.push(model.constructJsonForRecommend()); 
        }

        res.status(200).json(result);
    }
    catch(err){
        res.status(500).json(err);
    }
}

const post = async (req, res) => {
    try{
        const body = req.body;
        const result = await wrkOutMachineService.post(body);

        res.status(201).json(result);
    }
    catch(err){
        res.status(500).json(err);
    }
}

module.exports = {
    getAll,
    getId,
    recommendMachine,
    post,
}