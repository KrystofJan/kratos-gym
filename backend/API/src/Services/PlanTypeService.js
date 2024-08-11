const PlanTypeDAO = require("../ORM/AccessModels/PlanTypeDAO");

const getIdPlan = async (id) => {
  return await new PlanTypeDAO().getIdPlan(id);
};

const getIdType = async (id) => {
  return await new PlanTypeDAO().getIdType(id);
};

const post = async (body) => {
  return await new WranTypeDAO().post(body);
};
module.exports = {
  getIdPlan,
  getIdType,
  post,
};
