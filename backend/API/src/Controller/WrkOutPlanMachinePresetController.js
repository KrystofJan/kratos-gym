const wrkOutPlanMachinePresetService = require('../Services/WrkOutPlanMachinePresetService');
const wrkOutPlanPresetService = require('../Services/WrkOutPlanPresetService');
const wrkOutMachineService = require('../Services/WrkOutMachineService');
const PresetModel = require('../ORM/Models/WrkOutPlanPreset');
const MachineModel = require('../ORM/Models/WrkOutMachine');
const WrkOutPlanMachinePreset = require('../ORM/Models/WrkOutPlanMachinePreset');

const buildBody = async (planMachine) => {
    const result = [];

    for(const pm of planMachine){
        
        const planBody = await wrkOutPlanPresetService.getId(pm.WrkOutPlanId);
        const machineBody = await wrkOutMachineService.getId(pm.WrkOutMachineId);

        const plan = new PresetModel(planBody);
        const machine = new MachineModel(machineBody);

        const model = new WrkOutPlanMachinePreset({
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
    return result;
}

const getIdPreset = async (req,res,id) => {
    try{
        const planMachine = await wrkOutPlanMachinePresetService.getIdPreset(id);

        const result = await buildBody(planMachine);
        res.status(200).json(result);
    }
    catch(err){
        res.status(500).json(err);
    }
}

const getIdMachine = async (req,res,id) => {
    try{
        const planMachine = await wrkOutPlanMachinePresetService.getIdMachine(id);
        
        const result = await buildBody(planMachine);
        res.status(200).json(result);
    }
    catch(err){
        res.status(500).json(err);
    }
}

const post = async (req, res) => {
    try{
        const body = req.body;
        const result = await wrkOutPlanMachinePresetService.post(body);

        res.status(201).json(result);
    }
    catch(err){
        res.status(500).json(err);
    }
}

module.exports = {
    getIdPreset,
    getIdMachine,
    post,
}