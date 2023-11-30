const AddressDAO = require('../ORM/AccessModels/AddressDAO');

const getAll = async () => {
    const ee = await new AddressDAO().getAll();
    return ee;
}

module.exports = {
    getAll,
}