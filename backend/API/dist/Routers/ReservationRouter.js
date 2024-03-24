import express from 'express';
import { getAllReservations, getReservationById, postReservation } from '../Controller/ReservationController.js';
export var ReservationRouter = express.Router();
ReservationRouter.get('/', function (req, res) {
    getAllReservations(req, res);
});
ReservationRouter.get('/:id', function (req, res) {
    var id = parseInt(req.params['id']);
    console.log(id);
    getReservationById(req, res, id);
});
ReservationRouter.post('/', function (req, res) {
    postReservation(req, res);
});
