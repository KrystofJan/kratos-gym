import { Time } from '@internationalized/date'
import { Machine } from '../machine'
import { Reservation } from '../reservation'

// TODO: SPLIT everything

export interface NodeValue {
    machine: Machine
    start_time: Time
    end_time: Time
    reservation?: Reservation
}

// TODO: Use @internationalized/date functions
export function compareNodesTime(a: GraphNode, b: GraphNode) {
    const t1Value = a.value.end_time.hour * 60 + a.value.end_time.minute
    const t2Value = b.value.end_time.hour * 60 + b.value.end_time.minute
    return t1Value - t2Value
}

// TODO: Use @internationalized/date functions
export function compareTime(time1: Time, time2: Time, operator: string) {
    const t1Value = time1.hour * 60 + time1.minute
    const t2Value = time2.hour * 60 + time2.minute
    switch (operator) {
        case '>':
            return t1Value > t2Value
        case '>=':
            return t1Value >= t2Value
        case '<':
            return t1Value < t2Value
        case '<=':
            return t1Value <= t2Value
        case '===':
            return t1Value === t2Value
        default:
            throw new Error('operator ' + operator + 'is undefined')
    }
}

export function canFitInTime(timerange: [Time, Time], time: Time) {
    const [start, end] = timerange
    // TODO: Use @internationalized/date functions
    return compareTime(start, time, '<=') && compareTime(end, time, '>')
}

// TODO: Use @internationalized/date functions
export function addTime(time: Time, seconds: number): Time {
    let totalSeconds = time.hour * 3600 + time.minute * 60 + seconds

    let newHour = Math.floor((totalSeconds % 86400) / 3600) // Mod 86400 to stay within a day
    let newMinute = Math.floor((totalSeconds % 3600) / 60)

    return new Time(newHour, newMinute)
}

export class GraphNode {
    value: NodeValue
    node_id: number
    static numberOfNodes: number = 0
    neighbors: GraphNode[]

    constructor(value: NodeValue, neighbors: GraphNode[], node_id?: number) {
        this.value = value
        this.node_id = node_id || ++GraphNode.numberOfNodes
        this.neighbors = neighbors
        this.neighbors.sort(compareNodesTime)
    }

    addNeighbor(node: GraphNode) {
        this.neighbors.push(node)
        this.neighbors.sort(compareNodesTime)
    }

    addNeighbors(nodes: GraphNode[]) {
        this.neighbors.push(...nodes)
        this.neighbors.sort(compareNodesTime)
    }
}

export class Graph {
    nodes: GraphNode[]
    currentTime: Time
    desiredMachines: Machine[]

    constructor(
        nodes: GraphNode[] = [],
        startTime: Time,
        desiredMachines: Machine[]
    ) {
        this.nodes = nodes
        this.currentTime = startTime
        this.desiredMachines = desiredMachines
    }

    addNode(node: GraphNode) {
        this.nodes.push(node)
    }

    walk(
        currentNode: GraphNode,
        visited: number[] = [],
        result: Path = new Path(this.desiredMachines)
    ): Path {
        visited.push(currentNode.node_id)
        const neighbors = currentNode.neighbors.filter(
            (node) => !visited.includes(node.node_id)
        )

        const visitedMachines = result.nodes.map(
            (x) => x.value.machine.MachineId
        )
        for (const neighbor of neighbors) {
            if (visited.includes(neighbor.node_id)) {
                continue
            }
            const newTime = addTime(
                this.currentTime,
                neighbor.value.machine.AvgTimeTaken
            )
            if (
                canFitInTime(
                    [neighbor.value.start_time, neighbor.value.end_time],
                    newTime
                ) &&
                !visitedMachines.includes(neighbor.value.machine.MachineId)
            ) {
                result.addNode(
                    new GraphNode(
                        {
                            start_time: this.currentTime,
                            end_time: newTime,
                            machine: neighbor.value.machine,
                            reservation: neighbor.value.reservation,
                        },
                        neighbors,
                        neighbor.node_id
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
            const result = new Path(this.desiredMachines)
            const newTime = addTime(
                this.currentTime,
                node.value.machine.AvgTimeTaken
            )
            const nd = new GraphNode(
                {
                    start_time: this.currentTime,
                    end_time: newTime,
                    machine: node.value.machine,
                    reservation: node.value.reservation,
                },
                node.neighbors,
                node.node_id
            )
            result.addNode(nd)
            this.currentTime = newTime
            const path = this.walk(nd, [nd.node_id], result)
            paths.push(path)
        }
        return paths
    }
}

export class Path {
    nodes: GraphNode[]
    desired_node_values: Machine[]

    constructor(desired_machines: Machine[]) {
        this.nodes = []
        this.desired_node_values = desired_machines
    }

    addNode(node: GraphNode) {
        this.nodes.push(node)
    }

    isFound() {
        let isFull = true
        const foundMachines = this.nodes.map(
            (node) => node.value.machine.MachineId
        )
        for (const node of this.desired_node_values.map(
            (machine) => machine.MachineId
        )) {
            if (!foundMachines.includes(node)) {
                isFull = false
                break
            }
        }
        return isFull
    }
}
