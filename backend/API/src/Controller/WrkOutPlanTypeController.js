const wrkOutPlanTypeService = require('../Services/WrkOutPlanTypeService');
const wrkOutPlanService = require('../Services/WrkOutPlanService');
const typeService = require('../Services//ExerciseTypeService');
const PlanModel = require('../ORM/Models/WrkOutPlan');
const ExerciseTypeModel = require('../ORM/Models/ExerciseType');
const WrkOutMachinePlanModel = require('../ORM/Models/WrkOutPlanType');

const buildBody = async (planType) => {
    const result = [];

    for(const pt of planType){
        
        const planBody = await wrkOutPlanService.getId(pt.WrkOutPlanId);
        const typeBody = await typeService.get(pt.ExerciseTypeId);

        const plan = new PlanModel(planBody);
        const exerciseType = new ExerciseTypeModel(typeBody);

        const model = new WrkOutMachinePlanModel({
            "WrkOutPlan": plan.constructJson(),
            "ExerciseType": exerciseType.constructJson()
        });
        result.push(model.constructJson(model));
    }
    return result;
}

const getIdPlan = async (req,res,id) => {
    try{
        const planType = await wrkOutPlanTypeService.getIdPlan(id);
        
        const result = await buildBody(planType);
        res.status(200).json(result);
    }
    catch(err){
        res.status(500).json(err);
    }
}

const getIdType = async (req,res,id) => {
    try{
        const planType = await wrkOutPlanTypeService.getIdType(id);
        
        const result = await buildBody(planType);
        res.status(200).json(result);
    }
    catch(err){
        res.status(500).json(err);
    }
}

const post = async (req, res) => {
    try{
        const body = req.body;
        let response = {};

        if (body.ExerciseTypeIds){
            for(let exerciseTypeId of body.ExerciseTypeIds){
                const result = await wrkOutPlanTypeService.post(
                    {
                        "WrkOutPlanId": body.WrkOutPlanId,
                        "ExerciseTypeId": exerciseTypeId
                    }
                );
            }
            response = {
                "Status": `Created ${body.ExerciseTypeIds.length} plan type connection for the ${body.WrkOutPlanId}`
            };
        } 
        else{
            response  = await wrkOutPlanMachineService.post(body);
        }

        res.status(201).json(response);
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