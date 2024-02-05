const AddressDAO = require('../ORM/AccessModels/AddressDAO');

const getAll = async () => {
    return await new AddressDAO().getAll();;
}

const get = async (id) => {
    return await new AddressDAO().get(id);;
}

const post = async (body) => {
    return await new AddressDAO().post(body);
}

module.exports = {
    getAll,
    get,
    post,
}
