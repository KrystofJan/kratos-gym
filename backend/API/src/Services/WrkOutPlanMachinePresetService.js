const WrkOutPlanMachinePresetDAO = require('../ORM/AccessModels/WrkOutPlanMachinePresetDAO');

const getIdPreset = async (id) => {
    return await new WrkOutPlanMachinePresetDAO().getIdPreset(id);
}

const getIdMachine = async (id) => {
    return await new WrkOutPlanMachinePresetDAO().getIdMachine(id);
}

const post = async (body) => {
    return await new WrkOutPlanMachinePresetDAO().post(body);
}

module.exports = {
    getIdPreset,
    getIdMachine,
    post,
}
