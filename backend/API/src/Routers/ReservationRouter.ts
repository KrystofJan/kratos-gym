import express, { Request, Response, Router } from 'express';
const reservationController = require('../Controller/ReservationController');

export const ReservationRouter: Router = express.Router();

ReservationRouter.get('/', (req, res) => {
    reservationController.getAll(req, res);
});

ReservationRouter.get('/:id', (req, res) => {
    reservationController.getId( req,res,req.params['id']);
})

ReservationRouter.post('/', (req, res) => {
    reservationController.post( req,res);
    
});
