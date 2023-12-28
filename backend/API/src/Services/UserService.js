const userDAO = require('../ORM/AccessModels/UserDAO');

const getId = async (id) => {
    return await new userDAO().getId(id);
}

const getValueEmail = async (email) => {
    return await new userDAO().getValueIs(email,"email");
}

const getValueLogin = async (login) => {
    return await new userDAO().getValueIs(login,"login");
}

const register = async (body) => {
    return await new userDAO().post(body);
}
module.exports = {
    getId,
    getValueLogin,
    getValueEmail,
    register
}