const reservationDAO = require('../ORM/AccessModels/ReservationDAO');

const getId = async (id) => {
    return await new reservationDAO().getId(id);
}

const getAll= async () => {
    return await new reservationDAO().getAll();
}

module.exports = {
    getId,
    getAll,
}