const wrkOutPlanMachineService = require('../Services/WrkOutPlanMachineService');
const wrkOutPlanService = require('../Services/WrkOutPlanService');
const wrkOutMachineService = require('../Services/WrkOutMachineService');
const PlanModel = require('../ORM/Models/WrkOutPlan');
const MachineModel = require('../ORM/Models/WrkOutMachine');
const WrkOutPlanMachine = require('../ORM/Models/WrkOutPlanMachine');

const getIdPlan = async (req,res,id) => {
    try{
        const planMachine = await wrkOutPlanMachineService.getIdPlan(id);
        const result = [];

        for(const pm of planMachine){
            
            const planBody = await wrkOutPlanService.getId(pm.WrkOutPlanId);
            const machineBody = await wrkOutMachineService.getId(pm.WrkOutMachineId);
    
            const plan = new PlanModel();
            const machine = new MachineModel();

            plan.constructFromJson(planBody);
            machine.constructFromJson(machineBody);

            const model = new WrkOutPlanMachine({
                "WrkOutPlan": plan.constructJson(),
                "WrkOutMachine": machine.constructJson(),
                "Sets": pm.sets,
                "Reps": pm.reps,
                "WrkOutStartTime": pm.wrkOutStartTime,
                "WrkOutEndTime": pm.wrkOutEndTime,
                "CanDisturb": pm.canDisturb ? true : false
            });

            result.push(model.constructJson(model));
        }

        res.status(200).json(result);
    }
    catch(err){
        res.status(500).json(err);
    }
}

const getIdMachine = async (req,res,id) => {
    try{
        const planMachine = await wrkOutPlanMachineService.getIdMachine(id);
        const result = [];
console.log(planMachine);
        for(const pm of planMachine){
            
            const planBody = await wrkOutPlanService.getId(pm.WrkOutPlanId);
            const machineBody = await wrkOutMachineService.getId(pm.WrkOutMachineId);
    
            const plan = new PlanModel();
            const machine = new MachineModel();

            plan.constructFromJson(planBody);
            machine.constructFromJson(machineBody);

            const model = new WrkOutPlanMachine({
                "WrkOutPlan": plan.constructJson(),
                "WrkOutMachine": machine.constructJson(),
                "Sets": pm.sets,
                "Reps": pm.reps,
                "WrkOutStartTime": pm.wrkOutStartTime,
                "WrkOutEndTime": pm.wrkOutEndTime,
                "CanDisturb": pm.canDisturb ? true : false
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
        const result = await wrkOutPlanMachineService.post(body);

        res.status(201).json(result);
    }
    catch(err){
        res.status(500).json(err);
    }
}

module.exports = {
    getIdPlan,
    getIdMachine,
    post,
}