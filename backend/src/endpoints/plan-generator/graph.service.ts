import { NodeValue } from './node-value.mode'
import { compareTime, GraphNode } from './graph.model'

export class GraphService {
    static async CreateGraphNodes(dataset: NodeValue[][]) {
        try {
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
            return nodes
        } catch (err) {
            throw err
        }
    }
}
