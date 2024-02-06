const WrkOutPlanTypeDAO = require('../ORM/AccessModels/WrkOutPlanTypeDAO');

const getIdPlan = async (id) => {
    return await new WrkOutPlanTypeDAO().getIdPlan(id);
}

const getIdType = async (id) => {
    return await new WrkOutPlanTypeDAO().getIdType(id);
}

const post = async (body) => {
    return await new WrkOutPlanTypeDAO().post(body);
}
module.exports = {
    getIdPlan,
    getIdType,
    post,
}
