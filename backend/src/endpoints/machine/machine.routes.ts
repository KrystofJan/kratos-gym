import express, { Request, Response, Router, NextFunction } from 'express';
import { MachineController } from '.';
import { requireAuth } from '@clerk/express'
import { logger } from '../../utils';

export const MachineRouter: Router = express.Router();

MachineRouter.get('/', async (req: Request, res: Response) => {
    await MachineController.FindAll(req, res)
});

MachineRouter.get('/:id', async (req: Request, res: Response) => {
    await MachineController.FindById(req, res)
});

MachineRouter.post('/', async (req: Request, res: Response) => {
    await MachineController.Create(req, res)
});

MachineRouter.post('/:machineId/type/:typeId', async (req: Request, res: Response) => {
    await MachineController.AddType(req, res)
});

MachineRouter.delete('/:id', async (req: Request, res: Response) => {
    await MachineController.DeleteById(req, res)
});

MachineRouter.patch('/:id', async (req: Request, res: Response) => {
    await MachineController.UpdateById(req, res)
});

MachineRouter.get('/recommend/:id', async (req: Request, res: Response) => {
    await MachineController.RecommendById(req, res)
});

MachineRouter.get('/usage/:id', async (req: Request, res: Response) => {
    await MachineController.FindUsageForDate(req, res)
});

