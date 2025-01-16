import { Machine, Plan, PlanPost } from "..";
import { format } from 'date-fns'
import BaseService from "./base-service";

const KRATOS_API_URL = import.meta.env.VITE_KRATOS_API_URL

export class PlanService extends BaseService<Plan, PlanPost> {

    constructor() {
        super("plan")
    }


    async FetchPlansOnDate(params: { machine_id: number, date: Date }): Promise<Plan[]> {
        const { machine_id, date } = params
        try {
            const res = await fetch(`${KRATOS_API_URL}/api/${this.path}?machine_id=${machine_id}&date=${format(date, "yyyy-MM-dd")}`);
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            return data;
        } catch (error) {
            console.error('Error fetching account:', error);
            throw error;
        }
    }

    async FetchPlansMachines(planId: number): Promise<Machine[]> {
        try {
            const res = await fetch(`${KRATOS_API_URL}/api/${this.path}/${planId}/machines`);
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            return data;
        } catch (error) {
            console.error('Error fetching account:', error);
            throw error;
        }
    }
}
