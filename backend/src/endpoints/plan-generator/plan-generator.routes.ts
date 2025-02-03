import express, { Request, Response, Router } from 'express'
import { StatusCodes } from 'http-status-codes'
import { Machine } from '../machine'
import {
    GraphNode,
    Graph,
    NodeValue,
    compareTime,
    canFitInTime,
} from './graph.model'
import { Time } from '@internationalized/date'
import { Reservation } from '../reservation'

export const generatorRouter: Router = express.Router()

generatorRouter.post('/', async (req: Request, res: Response) => {
    const { colliding } = req.query

    const desired_machines: Machine[] = [
        new Machine({
            MachineId: 1,
            MachineName: 'ASdasdasd',
            AvgTimeTaken: 375,
        }),
        new Machine({
            MachineId: 2,
            MachineName: 'ASdasdasd',
            AvgTimeTaken: 300,
        }),
        new Machine({
            MachineId: 3,
            MachineName: 'ASdasdasd',
            AvgTimeTaken: 275,
        }),
    ]

    const startTime: Time = new Time(9, 15)

    const subtractTime = (start: Time, end: Time) => {
        const date1 = new Date()
        date1.setHours(start.hour)
        date1.setMinutes(start.minute)
        const date2 = new Date(date1)
        date2.setHours(end.hour)
        date2.setMinutes(end.minute)

        return (date2.getTime() - date1.getTime()) / 60 / 1000
    }

    const occupiedData: NodeValue[] = [
        {
            machine: desired_machines[0],
            start_time: new Time(9, 0),
            end_time: new Time(9, 10),
            reservation: new Reservation({
                reservation_id: 1,
                can_collide: true,
            }),
        },
        {
            machine: desired_machines[0],
            start_time: new Time(9, 35),
            end_time: new Time(9, 40),
            reservation: new Reservation({
                reservation_id: 1,
                can_collide: true,
            }),
        },
        {
            machine: desired_machines[0],
            start_time: new Time(10, 0),
            end_time: new Time(10, 10),
            reservation: new Reservation({
                reservation_id: 1,
                can_collide: true,
            }),
        },
        {
            machine: desired_machines[0],
            start_time: new Time(10, 10),
            end_time: new Time(10, 30),
            reservation: new Reservation({
                reservation_id: 1,
                can_collide: false,
            }),
        },
        {
            machine: desired_machines[1],
            start_time: new Time(9, 0),
            end_time: new Time(9, 15),
            reservation: new Reservation({
                reservation_id: 1,
                can_collide: true,
            }),
        },
        {
            machine: desired_machines[1],
            start_time: new Time(9, 15),
            end_time: new Time(9, 30),
            reservation: new Reservation({
                reservation_id: 1,
                can_collide: true,
            }),
        },
        {
            machine: desired_machines[1],
            start_time: new Time(9, 35),
            end_time: new Time(9, 45),
            reservation: new Reservation({
                reservation_id: 1,
                can_collide: true,
            }),
        },
        {
            machine: desired_machines[2],
            start_time: new Time(9, 20),
            end_time: new Time(9, 25),
            reservation: new Reservation({
                reservation_id: 1,
                can_collide: true,
            }),
        },
        {
            machine: desired_machines[2],
            start_time: new Time(9, 25),
            end_time: new Time(9, 35),
            reservation: new Reservation({
                reservation_id: 1,
                can_collide: false,
            }),
        },
        {
            machine: desired_machines[2],
            start_time: new Time(9, 35),
            end_time: new Time(9, 45),
            reservation: new Reservation({
                reservation_id: 1,
                can_collide: true,
            }),
        },
    ]

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
                compareTime(upravene[i][j].start_time, startTime, '>')
            ) {
                dat.push({
                    machine: upravene[i][j].machine,
                    start_time: startTime,
                    end_time: upravene[i][j].start_time,
                })
            }
            dat.push(upravene[i][j])
            if (
                j + 1 < upravene[i].length &&
                compareTime(
                    upravene[i][j].end_time,
                    upravene[i][j + 1].start_time,
                    '<'
                )
            ) {
                dat.push({
                    machine: upravene[i][j].machine,
                    start_time: upravene[i][j].end_time,
                    end_time: upravene[i][j + 1].start_time,
                })
            }
            lastJ = j
        }
        if (
            upravene[i][lastJ].end_time.hour <= 23 &&
            upravene[i][lastJ].end_time.minute <= 59
        ) {
            dat.push({
                machine: upravene[i][lastJ].machine,
                start_time: upravene[i][lastJ].end_time,
                end_time: new Time(23, 59),
            })
        }
        data.push(dat)
    }

    const no_collisions_data = data.map((x) => [
        ...x.filter((y) => !y.reservation),
    ])

    // res.status(StatusCodes.OK).json(no_collisions_data)
    // return

    const collisions_data: NodeValue[][] = []
    const collisions_dataset = []
    for (const col of data) {
        collisions_dataset.push(
            // TODO: Figure out can_collide stuff
            // col.filter((x) => !x.reservation || x.reservation.can_collide)
            col.filter((x) => !x.reservation)
        )
    }

    for (let i = 0; i < collisions_dataset.length; ++i) {
        const esketit: NodeValue[] = []
        let j = 0

        while (j < collisions_dataset[i].length) {
            const { index, start_time, end_time } = findEndingGap(
                collisions_dataset[i],
                j
            )
            esketit.push({
                machine: collisions_dataset[i][j].machine,
                start_time,
                end_time,
            })
            j = index + 1 // Move to the next unprocessed block
        }

        collisions_data.push(esketit)
    }

    function findEndingGap(
        data_tmp: NodeValue[],
        index: number
    ): { index: number; start_time: Time; end_time: Time } {
        const start_time = data_tmp[index].start_time
        let end_time = data_tmp[index].end_time

        // Continue merging only if end_time === start_time of the next block
        while (
            index + 1 < data_tmp.length &&
            compareTime(end_time, data_tmp[index + 1].start_time, '===')
        ) {
            index++
            end_time = data_tmp[index].end_time // Extend the end_time to the next block's end_time
        }

        return {
            index, // Return the updated index
            start_time,
            end_time,
        }
    }

    const dataset = collisions_data
    console.log(JSON.stringify(dataset, null, 4))
    const nodes: GraphNode[] = []

    for (const data_values of dataset) {
        for (const data_value of data_values) {
            nodes.push(new GraphNode(data_value, []))
        }
    }

    for (const currentNode of nodes) {
        currentNode.addNeighbors(
            nodes.filter(
                (node: GraphNode) =>
                    compareTime(
                        node.value.end_time,
                        currentNode.value.start_time,
                        '>'
                    ) &&
                    currentNode.node_id !== node.node_id &&
                    currentNode.value.machine.MachineId !==
                        node.value.machine.MachineId
            )
        )
    }

    const graph = new Graph(nodes, startTime, desired_machines)
    const paths = graph.findAllPaths()
    const result = []
    for (let i = 0; i < paths.length; ++i) {
        console.log('\n')
        console.log(i)
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
    res.status(StatusCodes.OK).json(result)
})
