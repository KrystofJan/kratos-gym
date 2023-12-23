const wrkOutMachineDAO = require('../ORM/AccessModels/WrkOutMachineDAO');

const getAll = async () => {
    return await new wrkOutMachineDAO().getAll();
}

const getId = async (id) => {
    return await new wrkOutMachineDAO().getId(id);
}
const recommendMachine = async (id) => {
    return await new wrkOutMachineDAO().recommendMachine(id);
}

module.exports = {
    getAll,
    getId,
    recommendMachine,
}