import { Machine, Plan } from "..";
import { format } from 'date-fns'

const KRATOS_API_URL = import.meta.env.VITE_KRATOS_API_URL

export class PlanService {

    constructor() {
    }

    async FetchPlans(): Promise<Plan[]> {
        try {
            const res = await fetch(`${KRATOS_API_URL}/api/plan`);
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

    async FetchPlansOnDate(params: { machine_id: number, date: Date }): Promise<Plan[]> {
        const { machine_id, date } = params
        try {
            const res = await fetch(`${KRATOS_API_URL}/api/plan?machine_id=${machine_id}&date=${format(date, "yyyy-MM-dd")}`);
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
            const res = await fetch(`${KRATOS_API_URL}/api/plan/${planId}/machines`);
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
