import express, { Request, Response, Router } from 'express'
import { Address } from '../address/address.model'
import { SelectQuery } from '../../database/query-builder'
import { TestingController } from './testing.controller'
import { clerkClient, requireAuth } from '@clerk/express'

export const TestingTable: Router = express.Router()

TestingTable.get('/', async (req: Request, res: Response) => {
    await TestingController.FindAll(req, res)
})
