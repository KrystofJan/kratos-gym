const WrkOutPlanMachineDAO = require('../ORM/AccessModels/WrkOutPlanMachineDAO');

const getIdPlan = async (id) => {
    return await new WrkOutPlanMachineDAO().getIdPlan(id);
}

const getIdMachine = async (id) => {
    return await new WrkOutPlanMachineDAO().getIdMachine(id);
}

const getOccupiedMachineAmount = async (id, time, date) => {
    return await new WrkOutPlanMachineDAO().getOccupiedMachineAmount(id, time, date);
}

const post = async (body) => {
    return await new WrkOutPlanMachineDAO().post(body);
}
module.exports = {
    getIdPlan,
    getIdMachine,
    post,
    getOccupiedMachineAmount,
}
