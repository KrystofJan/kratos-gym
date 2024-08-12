import express from 'express';
import { getAllReservations, getReservationById, postReservation } from '../Controller/ReservationController.js';
export const ReservationRouter = express.Router();
ReservationRouter.get('/', (req, res) => {
    getAllReservations(req, res);
});
ReservationRouter.get('/:id', (req, res) => {
    const id = parseInt(req.params['id']);
    getReservationById(req, res, id);
});
ReservationRouter.post('/', (req, res) => {
    postReservation(req, res);
});
