import { IDictionary } from '../../utils'
import { Account } from '../account/account.model'
import { Model } from '../base'
import {
    Column,
    UnInsertable,
    ManyToMany,
    ForeignKey,
    PrimaryKey,
    Table,
} from '../../database'
import { MachinesInPlan } from './machines-in-plan.model'
import { ExerciseCategory } from '../exercise-category'

@Table('plan')
@PrimaryKey('plan_id')
export class Plan extends Model {
    @Column('plan_id')
    public PlanId: number

    @Column('plan_name')
    public PlanName: string

    @ForeignKey(Account)
    @Column('account_id')
    public User: Account | undefined

    @UnInsertable()
    @ManyToMany(MachinesInPlan, 'plan_machines')
    public Machines: MachinesInPlan[]

    @UnInsertable()
    @ManyToMany(ExerciseCategory, 'plan_category')
    public ExerciseCategories: ExerciseCategory[]

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(jsonData: IDictionary<any>) {
        super()
        this.PlanId = jsonData['plan_id'] ?? jsonData['PlanId']
        this.PlanName = jsonData['plan_name'] ?? jsonData['PlanName']
        if (jsonData['User']) {
            this.User = new Account(jsonData['User'])
        } else {
            this.User = new Account(jsonData)
            if (!this.User.AccountId) {
                this.User = undefined
            }
        }
        this.Machines = []
        if (jsonData['Machines']) {
            for (const machine of jsonData['Machines'])
                this.Machines.push(new MachinesInPlan(machine))
        }
        this.ExerciseCategories = []

        if (jsonData['ExerciseCategories']) {
            for (const type of jsonData['ExerciseCategories'])
                this.ExerciseCategories.push(new ExerciseCategory(type))
        }
    }
}
