import express, { Request, Response, Router } from 'express'
import { ExerciseTypeController } from './exercise-type.controller'

export const ExerciseTypeRouter: Router = express.Router()

ExerciseTypeRouter.get('/', async (req: Request, res: Response) => {
    await ExerciseTypeController.FindAll(req, res)
})

ExerciseTypeRouter.get('/:id', async (req: Request, res: Response) => {
    await ExerciseTypeController.FindById(req, res)
})

ExerciseTypeRouter.get('/machine/:id', async (req: Request, res: Response) => {
    await ExerciseTypeController.FindByMachineId(req, res)
})

ExerciseTypeRouter.post('/', async (req: Request, res: Response) => {
    await ExerciseTypeController.Create(req, res)
})

ExerciseTypeRouter.delete('/:id', async (req: Request, res: Response) => {
    await ExerciseTypeController.DeleteById(req, res)
})

ExerciseTypeRouter.patch('/:id', async (req: Request, res: Response) => {
    await ExerciseTypeController.UpdateById(req, res)
})
