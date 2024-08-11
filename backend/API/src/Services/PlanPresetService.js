const wrkOutPlanPresetDAO = require("../ORM/AccessModels/PlanPresetDAO");

const getAll = async () => {
  return await new wrkOutPlanPresetDAO().getAll();
};

const getId = async (id) => {
  return await new wrkOutPlanPresetDAO().getId(id);
};

const post = async (body) => {
  return await new wrkOutPlanPresetDAO().post(body);
};
module.exports = {
  getAll,
  getId,
  post,
};
