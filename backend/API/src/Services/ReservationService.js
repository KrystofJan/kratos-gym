const ReservationDAO = require('../ORM/AccessModels/ReservationDAO');

const getId = async (id) => {
    return await new ReservationDAO().getId(id);
}

const getAll= async () => {
    return await new ReservationDAO().getAll();
}
const post = async (body) => {
    return await new ReservationDAO().post(body);
}

module.exports = {
    getId,
    getAll,
    post,
}
