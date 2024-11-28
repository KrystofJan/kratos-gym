import { IDictionary } from '../../utils';
import { Model } from '../base';
import { Column, ForeignKey, Table, PrimaryKey, DifferentlyNamedForeignKey } from "../../database";

import { Plan } from '../plan/plan.model';
import { Machine } from './machine.model';


@Table("get_plan_machines_with_next_and_prev")
@PrimaryKey("plan_id")
export class MachineUsage extends Model {
    @ForeignKey(Plan)
    @Column("plan_id")
    public Plan: Plan


    @ForeignKey(Machine)
    @Column("machine_id")
    public Machine: Machine

    @Column("start_time")
    public StartTime: Date;

    @Column("end_time")
    public EndTime: Date;


    @ForeignKey(Plan)
    @DifferentlyNamedForeignKey("PreviousPlanId")
    @Column("previous_plan_id")
    public PreviousPlan: Plan

    @Column("previous_start_time")
    public PreviousStartTime: Date;

    @Column("previous_end_time")
    public PreviousEndTime: Date;


    @ForeignKey(Plan)
    @DifferentlyNamedForeignKey("NextPlanId")
    @Column("next_plan_id")
    public NextPlan: Plan

    @Column("next_start_time")
    public NextStartTime: Date;

    @Column("next_end_time")
    public NextEndTime: Date;

    // TODO: Add can disturb id DB for each
    // @Column("can_disturb")
    // public CanDisturb: boolean;

    constructor(jsonData: IDictionary<any>) {
        super();

        this.StartTime = jsonData["StartTime"] ?? jsonData["start_time"]
        this.EndTime = jsonData["EndTime"] ?? jsonData["end_time"]

        if (jsonData["plan"]) {
            this.Plan = jsonData["plan"]
        } else {
            this.Plan = new Plan(jsonData)
        }
        this.Machine = new Machine(jsonData)


        if (jsonData["previous_plan"]) {
            this.PreviousPlan = jsonData["previous_plan"]
        } else {
            this.PreviousPlan = new Plan(jsonData)
        }

        this.PreviousStartTime = jsonData["PreviousStartTime"] ?? jsonData["previous_start_time"]
        this.PreviousEndTime = jsonData["PreviousEndTime"] ?? jsonData["previous_end_time"]


        if (jsonData["next_plan"]) {
            this.NextPlan = jsonData["next_plan"]
        } else {
            this.NextPlan = new Plan(jsonData)
        }
        this.NextStartTime = jsonData["NextStartTime"] ?? jsonData["next_start_time"]
        this.NextEndTime = jsonData["NextEndTime"] ?? jsonData["next_end_time"]
    }
}
