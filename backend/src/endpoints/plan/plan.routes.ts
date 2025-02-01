import express, { Request, Response, Router } from 'express'
import { PlanController } from '.'
import { StatusCodes } from 'http-status-codes'
import { logger } from '../../utils'
import { P } from 'pino'

export const PlanRouter: Router = express.Router()

PlanRouter.get('/', async (req: Request, res: Response) => {
    await PlanController.FindAll(req, res)
})

PlanRouter.get('/:id', async (req: Request, res: Response) => {
    await PlanController.FindById(req, res)
})

PlanRouter.post('/', async (req: Request, res: Response) => {
    await PlanController.Create(req, res)
})

PlanRouter.delete('/:id', async (req: Request, res: Response) => {
    await PlanController.DeleteById(req, res)
})

PlanRouter.patch('/:id', async (req: Request, res: Response) => {
    await PlanController.UpdateById(req, res)
})

PlanRouter.get('/:id/machines', async (req: Request, res: Response) => {
    await PlanController.FindPlanMachines(req, res)
})

PlanRouter.get('/:id/types', async (req: Request, res: Response) => {
    await PlanController.FindTypes(req, res)
})

PlanRouter.post(
    '/:planId/machine/:machineId',
    async (req: Request, res: Response) => {
        await PlanController.AddMachine(req, res)
    }
)

PlanRouter.post(
    '/:planId/type/:typeId',
    async (req: Request, res: Response) => {
        await PlanController.AddType(req, res)
    }
)

PlanRouter.delete(
    '/:planId/machine/:machineId',
    async (req: Request, res: Response) => {
        await PlanController.RemoveMachineFromPlan(req, res)
    }
)

PlanRouter.patch(
    '/:planId/machine/:machineId',
    async (req: Request, res: Response) => {
        await PlanController.UpdateMachineByBothIds(req, res)
    }
)

PlanRouter.delete(
    '/:planId/type/:typeId',
    async (req: Request, res: Response) => {
        await PlanController.RemoveTypeFromPlan(req, res)
    }
)

