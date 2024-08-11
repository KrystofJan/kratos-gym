const PlanMachineDAO = require("../ORM/AccessModels/PlanMachineDAO");

const getIdPlan = async (id) => {
  return await new PlanMachineDAO().getIdPlan(id);
};

const getIdMachine = async (id) => {
  return await new WranMachineDAO().getIdMachine(id);
};

const getOccupiedMachineAmount = async (id, time, date) => {
  return await new PlanMachineDAO().getOccupiedMachineAmount(id, time, date);
};

const post = async (body) => {
  return await new WranMachineDAO().post(body);
};
module.exports = {
  getIdPlan,
  getIdMachine,
  post,
  getOccupiedMachineAmount,
};
