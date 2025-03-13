import { Request, Response } from 'express'
import { safeAwait } from '../../utils/utilities'
import { Time } from '@internationalized/date'
import { CodedError, ErrorCode } from '../../errors'
import { StatusCodes } from 'http-status-codes'
import { FailedResponse } from '../../request-utility'
import {
    planGeneratorErrorHandler,
    PlanGeneratorQueryParams,
    PlanGeneratorService,
} from '.'
import { Graph, DataSetType } from './graph'
import { logger } from '../../utils'
import { GeneratorPost } from './plan-generator-request.model'
import { NodeValue } from './graph/node-value.model'
import { machineErrorHandler, MachineService } from '../machine'

export class PlanGeneratorController {
    static async Generate(req: Request, res: Response) {
        const { collisions } = req.query as PlanGeneratorQueryParams
        const postData = req.body as GeneratorPost
        console.log(postData)

        const [err, data] = await safeAwait(
            PlanGeneratorService.FetchPlanInformation(postData)
        )
        if (err !== null) {
            logger.error(err)
            const error = err as CodedError
            const statusCode = planGeneratorErrorHandler.handleError(error)
            const response = new FailedResponse(
                error.message,
                statusCode,
                error.code
            )
            response.buildResponse(req, res)
            return
        }

        let datasetType =
            collisions === true
                ? DataSetType.COLLIDING
                : DataSetType.NON_COLLIDING

        if (collisions === undefined) {
            datasetType = DataSetType.COLLIDING
        }

        const start_time = new Time(
            postData.start_time.hour,
            postData.start_time.minute
        )

        for (const mid of postData.machine_ids) {
            const [err, machine] = await safeAwait(
                MachineService.GetMachineById(mid)
            )

            if (err !== null) {
                logger.error(err)
                const error = err as CodedError
                const statusCode = machineErrorHandler.handleError(error)
                const response = new FailedResponse(
                    error.message,
                    statusCode,
                    error.code
                )
                response.buildResponse(req, res)
                return
            }
            if (data.map((x) => x.machine.MachineId).includes(mid)) {
                continue
            }

            const d = new NodeValue({
                start_time,
                end_time: new Time(23, 59),
                can_disturb: true,
                machine,
            })
            data.push(d)
        }

        const [nodeError, nodes] = await safeAwait(
            new PlanGeneratorService().CreateDataset(
                data,
                start_time,
                postData.amount_of_people,
                datasetType
            )
        )

        if (nodeError !== null) {
            logger.error(err)
            const error = nodeError
            const statusCode = StatusCodes.INTERNAL_SERVER_ERROR
            const response = new FailedResponse(
                error.toString(),
                statusCode,
                ErrorCode.MAPPING_ERROR
            )
            response.buildResponse(req, res)
            return
        }

        const graph = new Graph(
            nodes,
            postData.start_time,
            postData.machine_ids
        )
        const paths = graph.findAllPaths()

        const result = []
        for (let i = 0; i < paths.length; ++i) {
            const d = paths[i].nodes.map((node) => {
                return {
                    NodeId: node.node_id,
                    MachineId: node.value.machine.MachineId,
                    StartTime: node.value.start_time,
                    EndTime: node.value.end_time,
                }
            })
            result.push(d)
        }
        res.status(StatusCodes.OK).json(result)
    }
}
