import express, { Request, Response, Router } from 'express'
import { ReservationController } from './reservation.controller'

export const ReservationRouter: Router = express.Router()

ReservationRouter.get('/', async (req: Request, res: Response) => {
    await ReservationController.FindAll(req, res)
})

ReservationRouter.get('/:id', async (req: Request, res: Response) => {
    await ReservationController.FindById(req, res)
})

ReservationRouter.post('/', async (req: Request, res: Response) => {
    await ReservationController.Create(req, res)
})

ReservationRouter.post('/full', async (req: Request, res: Response) => {
    await ReservationController.CreateFullReservation(req, res)
})

ReservationRouter.delete('/:id', async (req: Request, res: Response) => {
    await ReservationController.DeleteById(req, res)
})

ReservationRouter.patch('/:id', async (req: Request, res: Response) => {
    await ReservationController.UpdateById(req, res)
})
