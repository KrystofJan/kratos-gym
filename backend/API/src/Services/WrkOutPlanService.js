const wrkOutPlanDAO = require('../ORM/AccessModels/WrkOutPlanDAO');

const getAll = async () => {
    return await new wrkOutPlanDAO().getAll();
}

const getId = async (id) => {
    return await new wrkOutPlanDAO().getId(id);
}

module.exports = {
    getAll,
    getId,
}