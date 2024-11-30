import { RequestQueryParams } from "../base";

export interface MachineQueryParams extends RequestQueryParams {
}

export interface MachineUsageQueryParams extends RequestQueryParams {
    desired_date?: Date
    desired_start_time?: string
    desired_end_time?: string
}
