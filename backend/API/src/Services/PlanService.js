const wrkOutPlanDAO = require("../ORM/AccessModels/PlanDAO");

const getAll = async () => {
  return await new wrkOutPlanDAO().getAll();
};

const getId = async (id) => {
  return await new wrkOutPlanDAO().getId(id);
};

const post = async (body) => {
  return await new wrkOutPlanDAO().post(body);
};
module.exports = {
  getAll,
  getId,
  post,
};

