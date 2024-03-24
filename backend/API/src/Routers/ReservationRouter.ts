import express, { Request, Response, Router } from 'express';
import { getAllReservations, getReservationById, postReservation } from '../Controller/ReservationController.js';

export const ReservationRouter: Router = express.Router();

ReservationRouter.get('/', (req, res) => {
    getAllReservations(req, res);
});

ReservationRouter.get('/:id', (req, res) => {
    const id = parseInt(req.params['id']);
    console.log(id);
    getReservationById(req,res,id);
})

ReservationRouter.post('/', (req, res) => {
    postReservation(req,res);
});
