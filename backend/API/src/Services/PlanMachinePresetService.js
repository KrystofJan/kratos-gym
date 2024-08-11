const PlanMachinePresetDAO = require("../ORM/AccessModels/PlanMachinePresetDAO");

const getIdPreset = async (id) => {
  return await new PlanMachinePresetDAO().getIdPreset(id);
};

const getIdMachine = async (id) => {
  return await new PlanMachinePresetDAO().getIdMachine(id);
};

const post = async (body) => {
  return await new WranMachinePresetDAO().post(body);
};

module.exports = {
  getIdPreset,
  getIdMachine,
  post,
};
