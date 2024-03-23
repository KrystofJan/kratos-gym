import express from 'express';
var reservationController = require('../Controller/ReservationController');
export var ReservationRouter = express.Router();
ReservationRouter.get('/', function (req, res) {
    reservationController.getAll(req, res);
});
ReservationRouter.get('/:id', function (req, res) {
    reservationController.getId(req, res, req.params['id']);
});
ReservationRouter.post('/', function (req, res) {
    reservationController.post(req, res);
});
