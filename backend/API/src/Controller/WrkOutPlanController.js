const wrkOutPlanService = require('../Services/WrkOutPlanService');
const WrkOutPlanModel = require('../ORM/Models/WrkOutPlan');
const userService = require('../Services/UserService');
const userModel = require('../ORM/Models/User');

const getId = async (req,res,id) => {
    try{
        const wrkOutPlan = await wrkOutPlanService.getId(id);
        
        const model = new WrkOutPlanModel();
        
        model.constructFromJson(wrkOutPlan);
        
        const customerData = await userService.getId(wrkOutPlan.CustomerId);

        const customer =  new userModel();
        customer.constructFromJson(
            customerData
        );

        model.customer = customer.constructJson();
        
        res.status(200).json(model.constructJson(wrkOutPlan));
    }
    catch(err){
        res.status(500).json(err);
    }
}

const getAll = async (req,res) => {

    try{
        const wrkOutPlan = await wrkOutPlanService.getAll();

        const model = new WrkOutPlanModel();
        
        const results = [];
        
        for (const b of wrkOutPlan){
            const a = new WrkOutPlanModel();
            a.constructFromJson(b);
            const userData = await userService.getId(b.UserId);
            
            
            const user =  new userModel();
            user.constructFromJson(
                userData
            );

            a.user = user.constructJson();

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