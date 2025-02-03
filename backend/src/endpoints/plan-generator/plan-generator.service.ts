import { Time } from '@internationalized/date'
import { PlanGeneratorDatabase } from './plan-generator.database'
import { NodeValue } from './graph.model'
import { compareTime } from './graph.model'
// NOTE: This will contain 3 funcs
// 1. will fetch the data using the PlanGEneratorDatabase
// 2. Will get manipulate data that will be used for the collisions true
// 3. Will get manipulate data that will be used for the collisions false
export class PlanGeneratorService {
    // TODO

    static async FetchPlanInformation() { // machine_ids: number[] // amount_of_people: number, // start_time: Time, // reservation_date: Date,
        // TODO
        // const _ = new PlanGeneratorDatabase()
        //     .Select
        // reservation_date,
        // start_time,
        // amount_of_people,
        // machine_ids
        // ()
        return { asdasd: 'asd' }
    }

    private PrepareDataset(occupiedData: NodeValue[], startTime: Time) {
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

        return data
    }

    async CreateDataset() {}
}
