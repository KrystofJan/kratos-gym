import express, { Request, Response, Router } from 'express';
import { ExerciseCategoryController } from './exercise-category.controller';

export const ExerciseCategoryRouter: Router = express.Router();

ExerciseCategoryRouter.get('/', async (req: Request, res: Response) => {
    await ExerciseCategoryController.FindAll(req, res)
});

ExerciseCategoryRouter.get('/:id', async (req: Request, res: Response) => {
    await ExerciseCategoryController.FindById(req, res)
});

ExerciseCategoryRouter.post('/', async (req: Request, res: Response) => {
    await ExerciseCategoryController.Create(req, res)
});

ExerciseCategoryRouter.delete('/:id', async (req: Request, res: Response) => {
    await ExerciseCategoryController.DeleteById(req, res)
});

ExerciseCategoryRouter.patch('/:id', async (req: Request, res: Response) => {
    await ExerciseCategoryController.UpdateById(req, res)
});
