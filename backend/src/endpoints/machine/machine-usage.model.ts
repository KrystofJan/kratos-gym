import { IDictionary } from '../../utils'
import { Model } from '../base'
import {
    Column,
    ForeignKey,
    Table,
    PrimaryKey,
    DifferentlyNamedForeignKey,
} from '../../database'
import { Plan } from '../plan/plan.model'
import { Machine } from './machine.model'
import { json } from 'express'

@Table('get_plan_machines_with_next_and_prev')
@PrimaryKey('plan_id')
export class MachineUsage extends Model {
    @ForeignKey(Plan)
    @Column('plan_id')
    public Plan: Plan

    @ForeignKey(Machine)
    @Column('machine_id')
    public Machine: Machine

    @Column('start_time')
    public StartTime: Date

    @Column('end_time')
    public EndTime: Date

    @ForeignKey(Plan)
    @DifferentlyNamedForeignKey('PreviousPlanId')
    @Column('previous_plan_id')
    public PreviousPlan: Plan | null

    @Column('previous_start_time')
    public PreviousStartTime: Date

    @Column('previous_end_time')
    public PreviousEndTime: Date

    @ForeignKey(Plan)
    @DifferentlyNamedForeignKey('NextPlanId')
    @Column('next_plan_id')
    public NextPlan: Plan | null

    @Column('next_start_time')
    public NextStartTime: Date

    @Column('next_end_time')
    public NextEndTime: Date

    @Column('can_disturb')
    public CanDisturb: boolean

    @Column('can_fit')
    public CanFit: boolean

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(jsonData: IDictionary<any>) {
        super()

        this.StartTime = jsonData['StartTime'] ?? jsonData['start_time']
        this.EndTime = jsonData['EndTime'] ?? jsonData['end_time']

        if (jsonData['plan']) {
            this.Plan = jsonData['plan']
        } else {
            this.Plan = new Plan(jsonData)
        }
        this.Machine = new Machine(jsonData)
        this.CanDisturb = jsonData['CanDisturb'] ?? jsonData['can_disturb']
        this.CanFit = jsonData['CanFit'] ?? jsonData['can_fit']

        if (jsonData['previous_plan']) {
            this.PreviousPlan = jsonData['previous_plan']
        } else {
            const tmp = { ...jsonData }
            tmp['plan_id'] =
                tmp['previous_plan_id'] ?? jsonData['PreviousPlanId']
            this.PreviousPlan = new Plan(tmp)
            if (!this.PreviousPlan.PlanId) {
                this.PreviousPlan = null
            }
        }

        this.PreviousStartTime =
            jsonData['PreviousStartTime'] ?? jsonData['previous_start_time']
        this.PreviousEndTime =
            jsonData['PreviousEndTime'] ?? jsonData['previous_end_time']

        if (jsonData['next_plan']) {
            this.NextPlan = jsonData['next_plan']
        } else {
            const tmp = { ...jsonData }
            tmp['plan_id'] = tmp['next_plan_id'] ?? jsonData['NextPlanId']
            this.NextPlan = new Plan(tmp)

            if (!this.NextPlan.PlanId) {
                this.NextPlan = null
            }
        }
        this.NextStartTime =
            jsonData['NextStartTime'] ?? jsonData['next_start_time']
        this.NextEndTime = jsonData['NextEndTime'] ?? jsonData['next_end_time']
    }
}
