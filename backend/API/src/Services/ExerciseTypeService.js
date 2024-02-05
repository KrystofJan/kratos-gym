const ExerciseTypeDAO = require('../ORM/AccessModels/ExerciseTypeDAO');

const getAll = async () => {
    return await new ExerciseTypeDAO().getAll();;
}

const get = async (id) => {
    return await new ExerciseTypeDAO().get(id);;
}

const post = async (body) => {
    return await new ExerciseTypeDAO().post(body);
}

module.exports = {
    getAll,
    get,
    post,
}
