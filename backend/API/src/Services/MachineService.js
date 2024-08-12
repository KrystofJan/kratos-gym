const wrkOutMachineDAO = require("../ORM/AccessModels/MachineDAO");

const getAll = async () => {
  return await new wrkOutMachineDAO().getAll();
};

const getId = async (id) => {
  return await new wrkOutMachineDAO().getId(id);
};

const post = async (body) => {
  return await new wrkOutMachineDAO().post(body);
};

const recommendMachine = async (id) => {
  return await new wrkOutMachineDAO().recommendMachine(id);
};

module.exports = {
  getAll,
  getId,
  recommendMachine,
  post,
};

