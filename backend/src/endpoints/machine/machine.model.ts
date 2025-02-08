import { IDictionary } from '../../utils'
import { Model } from '../base'
import {
    Column,
    ManyToMany,
    PrimaryKey,
    Table,
    UnInsertable,
} from '../../database'
import { ExerciseType } from '../exercise-type'

@Table('machine')
@PrimaryKey('machine_id')
export class Machine extends Model {
    @Column('machine_id')
    public MachineId: number | null

    @Column('machine_name')
    public MachineName: string

    @Column('max_weight')
    public MaxWeight: number

    @Column('min_weight')
    public MinWeight: number

    @Column('max_people')
    public MaxPeople: number

    @Column('avg_time_taken')
    public AvgTimeTaken: number

    @Column('popularity_score')
    public PopularityScore: number

    @UnInsertable()
    @ManyToMany(ExerciseType, 'machine_exercise_type')
    public ExerciseTypes: ExerciseType[]

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(jsonData: IDictionary<any>) {
        super()

        this.MachineId = jsonData['MachineId'] ?? jsonData['machine_id']
        this.MachineName = jsonData['MachineName'] ?? jsonData['machine_name']
        this.MaxWeight = jsonData['MaxWeight'] ?? jsonData['max_weight']
        this.MinWeight = jsonData['MinWeight'] ?? jsonData['min_weight']
        this.MaxPeople = jsonData['MaxPeople'] ?? jsonData['max_people']
        this.AvgTimeTaken =
            jsonData['AvgTimeTaken'] ?? jsonData['avg_time_taken']
        this.PopularityScore =
            jsonData['PopularityScore'] ?? jsonData['popularity_score']
        this.ExerciseTypes = []
    }
}
