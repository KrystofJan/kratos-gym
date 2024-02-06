const wrkOutPlanTypeService = require('../Services/WrkOutPlanTypeService');
const wrkOutPlanService = require('../Services/WrkOutPlanService');
const typeService = require('../Services//ExerciseTypeService');
const PlanModel = require('../ORM/Models/WrkOutPlan');
const ExerciseTypeModel = require('../ORM/Models/ExerciseType');
const WrkOutMachinePlanModel = require('../ORM/Models/WrkOutPlanType');

const getIdPlan = async (req,res,id) => {
    try{
        const planType = await wrkOutPlanTypeService.getIdPlan(id);
        const result = [];

        for(const pt of planType){
            
            const planBody = await wrkOutPlanService.getId(pt.WrkOutPlanId);
            const typeBody = await typeService.get(pt.ExerciseTypeId);
    
            const plan = new PlanModel();
            const exerciseType = new ExerciseTypeModel();
            
            plan.constructFromJson(planBody);
            exerciseType.constructFromJson(typeBody);
    
            const model = new WrkOutMachinePlanModel({
                "WrkOutPlan": plan.constructJson(),
                "ExerciseType": exerciseType.constructJson()
            });
            result.push(model.constructJson(model));
        }


        res.status(200).json(result);
    }
    catch(err){
        res.status(500).json(err);
    }
}

const getIdType = async (req,res,id) => {
    try{
        const planType = await wrkOutPlanTypeService.getIdType(id);

        const result = [];

        for(const pt of planType){
            
            const planBody = await wrkOutPlanService.getId(pt.WrkOutPlanId);
            const typeBody = await typeService.get(pt.ExerciseTypeId);
    
            const plan = new PlanModel();
            const exerciseType = new ExerciseTypeModel();
            
            
            plan.constructFromJson(planBody);
            exerciseType.constructFromJson(typeBody);
    
            const model = new WrkOutMachinePlanModel({
                "WrkOutPlan": plan.constructJson(),
                "ExerciseType": exerciseType.constructJson()
            });
            result.push(model.constructJson(model));
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
        const result = await wrkOutPlanTypeService.post(body);

        res.status(201).json(result);
    }
    catch(err){
        res.status(500).json(err);
    }
}

module.exports = {
    getIdPlan,
    getIdType,
    post,
}