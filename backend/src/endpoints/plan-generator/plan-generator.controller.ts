import { Request, Response } from 'express'
import { safeAwait } from '../../utils/utilities'
import { OkResponse } from '../../request-utility'
import { CodedError, ErrorCode } from '../../errors'
import { StatusCodes } from 'http-status-codes'
import { FailedResponse } from '../../request-utility'
import {
    planGeneratorErrorHandler,
    PlanGeneratorQueryParams,
    PlanGeneratorService,
} from '.'
import { Graph } from './graph.model'
import { logger } from '../../utils'
import { GeneratorPost } from './graph-request.model'
import { DataSetType } from './graph.model'
import { NodeValue } from './node-value.mode'

export class PlanGeneratorController {
    static async FindAll(req: Request, res: Response) {
        const { collisions } = req.query as PlanGeneratorQueryParams
        const postData = req.body as GeneratorPost

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

        let datasetType = DataSetType.COLLIDING
        if (collisions === false) {
            datasetType = DataSetType.NON_COLLIDING
        }
        const [nodeError, nodes] = await safeAwait(
            new PlanGeneratorService().CreateDataset(
                data,
                postData.start_time,
                datasetType
            )
        )

        if (nodeError !== null) {
            logger.error(err)
            const error = nodeError as CodedError
            const statusCode = planGeneratorErrorHandler.handleError(error)
            const response = new FailedResponse(
                error.message,
                statusCode,
                error.code
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
                    nodeId: node.node_id,
                    machine: node.value.machine.MachineId,
                    st: node.value.start_time,
                    et: node.value.end_time,
                    // originalNode: graph.nodes.filter(x => x.node_id === node.node_id).map(x => x.value)[0]
                }
            })
            result.push(d)
            console.log(JSON.stringify(d, null, 4))
        }
        /**
	     TODO: For some reason this is the result, fix it, 
	     probably something to do with the changed time implementation
	      [
		    [
			{
			    "nodeId": 1,
			    "st": "03:00:00",
			    "et": {
				"hour": null,
				"minute": null,
				"second": 0,
				"millisecond": 0
			    }
			}
		    ]
		]
	*/
        res.status(StatusCodes.OK).json(result)
    }
}
