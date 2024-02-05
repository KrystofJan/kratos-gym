const MachineExerciseTypesDAO = require('../ORM/AccessModels/MachineExerciseTypesDAO');

const getIdMachine = async (id) => {
    return await new MachineExerciseTypesDAO().getIdMachine(id);;
}

const getIdType = async (id) => {
    return await new MachineExerciseTypesDAO().getIdType(id);;
}

const post = async (body) => {
    return await new MachineExerciseTypesDAO().post(body);
}

module.exports = {
    getIdMachine,
    getIdType,
    post,
}
