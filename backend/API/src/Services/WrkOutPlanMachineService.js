const WrkOutPlanMachineDAO = require('../ORM/AccessModels/WrkOutPlanMachineDAO');

const getIdPlan = async (id) => {
    return await new WrkOutPlanMachineDAO().getIdPlan(id);
}

const getIdMachine = async (id) => {
    return await new WrkOutPlanMachineDAO().getIdMachine(id);
}

const post = async (body) => {
    return await new WrkOutPlanMachineDAO().post(body);
}
module.exports = {
    getIdPlan,
    getIdMachine,
    post,
}
