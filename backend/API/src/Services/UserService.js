const userDAO = require('../ORM/AccessModels/UserDAO');

const getId = async (id) => {
    return await new userDAO().getId(id);
}

module.exports = {
    getId,
}