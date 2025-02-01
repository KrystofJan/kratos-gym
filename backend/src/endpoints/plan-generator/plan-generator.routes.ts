import express, { Request, Response, Router } from 'express'
import { StatusCodes } from 'http-status-codes'

export const generatorRouter: Router = express.Router()

generatorRouter.post(
    "/",
    async (req: Request, res: Response) => {
        const { colliding } = req.query
        interface Time {
            hour: number,
            minute: number,
        }

        interface Machine {
            machine_id: number,
            avg_time_taken: number
        }

        interface Reservation {
            reservation_id: number
            can_collide: boolean
        }

        interface Data {
            machine: Machine,
            start_time: Time,
            end_time: Time,
            reservation?: Reservation,
        }

        const desired_machines: Machine[] = [
            {
                machine_id: 1,
                avg_time_taken: 375
            },
            {
                machine_id: 2,
                avg_time_taken: 300
            },
            {
                machine_id: 3,
                avg_time_taken: 275
            },
        ]


        const startTime: Time = { hour: 9, minute: 15 }

        const subtractTime = (start: Time, end: Time) => {
            const date1 = new Date()
            date1.setHours(start.hour)
            date1.setMinutes(start.minute)
            const date2 = new Date(date1)
            date2.setHours(end.hour)
            date2.setMinutes(end.minute)

            return (date2.getTime() - date1.getTime()) / 60 / 1000
        }

        const occupiedData: Data[] = [
            {
                machine: desired_machines[0],
                start_time: { hour: 9, minute: 0 },
                end_time: { hour: 9, minute: 10 },
                reservation: { reservation_id: 1, can_collide: true }
            },
            {
                machine: desired_machines[0],
                start_time: { hour: 9, minute: 35 },
                end_time: { hour: 9, minute: 40 },
                reservation: { reservation_id: 1, can_collide: true }
            },
            {
                machine: desired_machines[0],
                start_time: { hour: 10, minute: 0 },
                end_time: { hour: 10, minute: 10 },
                reservation: { reservation_id: 1, can_collide: true }
            },
            {
                machine: desired_machines[0],
                start_time: { hour: 10, minute: 10 },
                end_time: { hour: 10, minute: 30 },
                reservation: { reservation_id: 1, can_collide: false }
            },
            {
                machine: desired_machines[1],
                start_time: { hour: 9, minute: 0 },
                end_time: { hour: 9, minute: 15 },
                reservation: { reservation_id: 1, can_collide: true }
            },
            {
                machine: desired_machines[1],
                start_time: { hour: 9, minute: 15 },
                end_time: { hour: 9, minute: 30 },
                reservation: { reservation_id: 1, can_collide: true }
            },
            {
                machine: desired_machines[1],
                start_time: { hour: 9, minute: 35 },
                end_time: { hour: 9, minute: 45 },
                reservation: { reservation_id: 1, can_collide: true }
            },
            {
                machine: desired_machines[2],
                start_time: { hour: 9, minute: 20 },
                end_time: { hour: 9, minute: 25 },
                reservation: { reservation_id: 1, can_collide: true }
            },
            {
                machine: desired_machines[2],
                start_time: { hour: 9, minute: 25 },
                end_time: { hour: 9, minute: 35 },
                reservation: { reservation_id: 1, can_collide: false }
            },
            {
                machine: desired_machines[2],
                start_time: { hour: 9, minute: 35 },
                end_time: { hour: 9, minute: 45 },
                reservation: { reservation_id: 1, can_collide: true }
            }
        ]

        const first = [...new Set(occupiedData.map(x => x.machine.machine_id))]
        const upravene: Data[][] = []
        for (const f of first) {
            upravene.push(occupiedData.filter(x => x.machine.machine_id === f))
        }

        function compareTime(time1: Time, time2: Time, operator: string) {
            const t1Value = (time1.hour * 60) + time1.minute
            const t2Value = (time2.hour * 60) + time2.minute
            switch (operator) {
                case ">": return t1Value > t2Value
                case ">=": return t1Value >= t2Value
                case "<": return t1Value < t2Value
                case "<=": return t1Value <= t2Value
                case "===": return t1Value === t2Value
                default: throw new Error("operator " + operator + "is undefined")
            }
        }

        const data: Data[][] = []
        // create gaps
        for (let i = 0; i < upravene.length; ++i) {
            let lastJ = 0
            const dat: Data[] = []

            for (let j = 0; j < upravene[i].length; ++j) {
                if (j === 0 && compareTime(upravene[i][j].start_time, startTime, ">")) {
                    dat.push({
                        machine: upravene[i][j].machine,
                        start_time: startTime,
                        end_time: upravene[i][j].start_time
                    });
                }
                dat.push(upravene[i][j]);
                if (j + 1 < upravene[i].length && compareTime(upravene[i][j].end_time, upravene[i][j + 1].start_time, "<")) {
                    dat.push({
                        machine: upravene[i][j].machine,
                        start_time: upravene[i][j].end_time,
                        end_time: upravene[i][j + 1].start_time,
                    });
                }
                lastJ = j
            }
            if (upravene[i][lastJ].end_time.hour <= 23 && upravene[i][lastJ].end_time.minute <= 59) {
                dat.push({
                    machine: upravene[i][lastJ].machine,
                    start_time: upravene[i][lastJ].end_time,
                    end_time: { hour: 23, minute: 59 }
                })
            }
            data.push(dat)
        }

        const no_collisions_data = data.map(
            x => [...x.filter(
                y => !y.reservation
            )]
        )

        // res.status(StatusCodes.OK).json(no_collisions_data)
        // return

        const collisions_data: Data[][] = []
        const collisions_dataset = []
        for (const col of data) {
            collisions_dataset.push(col.filter(x => !x.reservation || x.reservation.can_collide))
        }

        for (let i = 0; i < collisions_dataset.length; ++i) {
            const esketit: Data[] = [];
            let j = 0;

            while (j < collisions_dataset[i].length) {
                const { index, start_time, end_time } = findEndingGap(collisions_dataset[i], j);
                esketit.push({
                    machine: collisions_dataset[i][j].machine,
                    start_time,
                    end_time
                });
                j = index + 1; // Move to the next unprocessed block
            }

            collisions_data.push(esketit);
        }

        function findEndingGap(data_tmp: Data[], index: number): { index: number, start_time: Time, end_time: Time } {
            const start_time = data_tmp[index].start_time;
            let end_time = data_tmp[index].end_time;

            // Continue merging only if end_time === start_time of the next block
            while (
                index + 1 < data_tmp.length &&
                compareTime(end_time, data_tmp[index + 1].start_time, "===")
            ) {
                index++;
                end_time = data_tmp[index].end_time; // Extend the end_time to the next block's end_time
            }

            return {
                index, // Return the updated index
                start_time,
                end_time
            };
        }

        class GraphNode {
            value: Data
            node_id: number
            static numberOfNodes: number = 0
            neighbors: GraphNode[]

            constructor(value: Data, neighbors: GraphNode[], node_id?: number) {
                this.value = value
                this.node_id = node_id || ++GraphNode.numberOfNodes
                this.neighbors = neighbors
                this.neighbors.sort(compareNodesTime)
            }

            addNeighbor(node: GraphNode) {
                this.neighbors.push(node);
                this.neighbors.sort(compareNodesTime)
            }

            addNeighbors(nodes: GraphNode[]) {
                this.neighbors.push(...nodes);
                this.neighbors.sort(compareNodesTime)
            }
        }
        function compareNodesTime(a: GraphNode, b: GraphNode) {
            const t1Value = (a.value.end_time.hour * 60) + a.value.end_time.minute
            const t2Value = (b.value.end_time.hour * 60) + b.value.end_time.minute
            return t1Value - t2Value
        }

        class Graph {
            nodes: GraphNode[]
            currentTime: Time

            constructor(nodes: GraphNode[] = []) {
                this.nodes = nodes
                this.currentTime = startTime
            }

            addNode(node: GraphNode) {
                this.nodes.push(node);
            }

            walk(
                currentNode: GraphNode,
                visited: number[] = [],
                result: Path = new Path()
            ): Path {

                visited.push(currentNode.node_id)
                const neighbors = currentNode.neighbors.filter(
                    node => !visited.includes(node.node_id)
                )

                const visitedMachines = result.nodes.map(x => x.value.machine.machine_id)
                for (const neighbor of neighbors) {
                    if (visited.includes(neighbor.node_id)) {
                        continue
                    }
                    const newTime = addTime(this.currentTime, neighbor.value.machine.avg_time_taken)
                    if (
                        canFitInTime([
                            neighbor.value.start_time,
                            neighbor.value.end_time
                        ], newTime) &&
                        !visitedMachines.includes(neighbor.value.machine.machine_id)
                    ) {

                        result.addNode(
                            new GraphNode({
                                start_time: this.currentTime,
                                end_time: newTime,
                                machine: neighbor.value.machine,
                                reservation: neighbor.value.reservation,
                            },
                                neighbors,
                                neighbor.node_id,
                            )
                        )
                        this.currentTime = newTime
                        if (result.isFound()) {
                            break
                        }
                        return this.walk(neighbor, visited, result)
                    }
                }
                return result
            }

            findAllPaths() {
                const paths: Path[] = []
                for (const node of this.nodes) {
                    this.currentTime = node.value.start_time
                    const result = new Path()
                    const newTime = addTime(this.currentTime, node.value.machine.avg_time_taken)
                    const nd =
                        new GraphNode({
                            start_time: this.currentTime,
                            end_time: newTime,
                            machine: node.value.machine,
                            reservation: node.value.reservation,
                        },
                            node.neighbors,
                            node.node_id,
                        )
                    result.addNode(
                        nd
                    )
                    this.currentTime = newTime
                    const path = this.walk(nd, [nd.node_id], result)
                    paths.push(path)
                }
                return paths

            }
        }

        class Path {
            nodes: GraphNode[]
            desired_node_values: Machine[]

            constructor() {
                this.nodes = []
                this.desired_node_values = desired_machines
            }

            addNode(node: GraphNode) {
                this.nodes.push(node);
            }

            isFound() {
                let isFull = true
                const foundMachines = this.nodes.map(node => node.value.machine.machine_id)
                for (const node of desired_machines.map(machine => machine.machine_id)) {
                    if (!foundMachines.includes(node)) {
                        isFull = false
                        break
                    }
                }
                return isFull
            }
        }

        function canFitInTime(timerange: [Time, Time], time: Time) {
            const [start, end] = timerange
            return compareTime(start, time, '<=') && compareTime(end, time, '>')
        }

        function addTime(time: Time, seconds: number): Time {
            let totalSeconds = time.hour * 3600 + time.minute * 60 + seconds;

            let newHour = Math.floor((totalSeconds % 86400) / 3600); // Mod 86400 to stay within a day
            let newMinute = Math.floor((totalSeconds % 3600) / 60);

            return { hour: newHour, minute: newMinute };
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
            currentNode.addNeighbors(nodes.filter((node: GraphNode) =>
                compareTime(node.value.end_time, currentNode.value.start_time, '>') &&
                currentNode.node_id !== node.node_id &&
                currentNode.value.machine.machine_id !== node.value.machine.machine_id
            ))
        }

        const graph = new Graph(nodes)
        const paths = graph.findAllPaths()
        for (let i = 0; i < paths.length; ++i) {
            console.log("\n")
            console.log(i)
            console.log(
                JSON.stringify(
                    paths[i].nodes.map(
                        node => {
                            return {
                                nodeId: node.node_id,
                                machine: node.value.machine.machine_id,
                                st: node.value.start_time,
                                et: node.value.end_time,
                                // originalNode: graph.nodes.filter(x => x.node_id === node.node_id).map(x => x.value)[0]
                            }
                        }),
                    null,
                    4
                )
            )

        }
        res.status(StatusCodes.OK).json(paths)
    })
