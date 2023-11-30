const express = require('express');
const reservationController = require('../Controller/ReservationController');

const ReservationRouter = express.Router();

ReservationRouter.get('/', (req, res) => {
    reservationController.getAll(req, res);
});

ReservationRouter.get('/:id', (req, res) => {
    reservationController.getId( req,res,req.params['id']);
})

module.exports = ReservationRouter;