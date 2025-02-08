import { Time } from '@internationalized/date'
import { PlanGeneratorDatabase } from './plan-generator.database'
import { NodeValue } from './graph/node-value.model'
import { CodedError, ErrorCode } from '../../errors'
import { GeneratorPost } from './plan-generator-request.model'
import { logger } from '../../utils'
import { GraphService, DataSetType } from './graph'
import { TimeUtils } from '../../utils'

export class PlanGeneratorService {
    // TODO

    static async FetchPlanInformation(input: GeneratorPost) {
        //
        // TODO
        try {
            const data = await new PlanGeneratorDatabase().Select(input)
            const nodeValues: NodeValue[] = data.Body.map((x) => {
                return new NodeValue(x)
            })
            return nodeValues
        } catch (err) {
            logger.error(err)
            throw new CodedError(
                ErrorCode.MAPPING_ERROR,
                'Mapping model at GetAllPlanes failed'
            )
        }
    }

    private prepareDataset(
        occupiedData: NodeValue[],
        startTime: Time
    ): NodeValue[][] {
        const first = [...new Set(occupiedData.map((x) => x.machine.MachineId))]
        const upravene: NodeValue[][] = []
        for (const f of first) {
            upravene.push(occupiedData.filter((x) => x.machine.MachineId === f))
        }
        const data: NodeValue[][] = []
        // create gaps
        for (let i = 0; i < upravene.length; ++i) {
            let lastJ = 0
            const dat: NodeValue[] = []

            for (let j = 0; j < upravene[i].length; ++j) {
                if (
                    j === 0 &&
                    TimeUtils.compareTime(
                        upravene[i][j].start_time,
                        startTime,
                        '>'
                    )
                ) {
                    dat.push(
                        new NodeValue({
                            machine: upravene[i][j].machine,
                            start_time: startTime,
                            end_time: upravene[i][j].start_time,
                        })
                    )
                }
                dat.push(upravene[i][j])
                if (
                    j + 1 < upravene[i].length &&
                    TimeUtils.compareTime(
                        upravene[i][j].end_time,
                        upravene[i][j + 1].start_time,
                        '<'
                    )
                ) {
                    dat.push(
                        new NodeValue({
                            machine: upravene[i][j].machine,
                            start_time: upravene[i][j].end_time,
                            end_time: upravene[i][j + 1].start_time,
                        })
                    )
                }
                lastJ = j
            }
            const lastTime = 23 * 60 + 59
            const currentTime =
                upravene[i][lastJ].end_time.hour * 60 +
                upravene[i][lastJ].end_time.minute
            if (currentTime < lastTime) {
                dat.push(
                    new NodeValue({
                        machine: upravene[i][lastJ].machine,
                        start_time: upravene[i][lastJ].end_time,
                        end_time: new Time(23, 59),
                    })
                )
            }
            data.push(dat)
        }

        return data
    }

    private getCollidingDataSet(input: NodeValue[][]): NodeValue[][] {
        const collisions_data: NodeValue[][] = []
        const collisions_dataset = []
        for (const col of input) {
            collisions_dataset.push(col.filter((x) => x.can_collide))
        }

        for (let i = 0; i < collisions_dataset.length; ++i) {
            const gapable_area: NodeValue[] = []
            let j = 0

            while (j < collisions_dataset[i].length) {
                const { index, start_time, end_time } = this.findEndingGap(
                    collisions_dataset[i],
                    j
                )

                gapable_area.push(
                    new NodeValue({
                        machine: collisions_dataset[i][j].machine,
                        start_time,
                        end_time,
                    })
                )

                j = index + 1
            }

            collisions_data.push(gapable_area)
        }
        return collisions_data
    }

    private findEndingGap(
        data: NodeValue[],
        index: number
    ): { index: number; start_time: Time; end_time: Time } {
        const start_time = data[index].start_time
        let end_time = data[index].end_time

        while (
            index + 1 < data.length &&
            TimeUtils.compareTime(end_time, data[index + 1].start_time, '===')
        ) {
            index++
            end_time = data[index].end_time // Extend the end_time to the next block's end_time
        }

        return {
            index, // Return the updated index
            start_time,
            end_time,
        }
    }
    private getNonCollidingDataSet(input: NodeValue[][]): NodeValue[][] {
        return input.map((x) => [...x.filter((y) => !y.reservation)])
    }

    async CreateDataset(
        input: NodeValue[],
        start_time: Time,
        datasetType: DataSetType
    ) {
        try {
            const data = this.prepareDataset(input, start_time)
            const col = this.getCollidingDataSet(data)

            if (datasetType === DataSetType.COLLIDING) {
                return await GraphService.CreateGraphNodes(col)
            }
            return await GraphService.CreateGraphNodes(
                this.getNonCollidingDataSet(data)
            )
        } catch (err) {
            throw err
        }
    }
}
