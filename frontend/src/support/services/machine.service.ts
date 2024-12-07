
import type { Machine, TimeSuggestion } from '../types';
import { fillParamValues } from '../request-utils';
import { Time } from "@internationalized/date";
import { format } from 'date-fns';

const KRATOS_API_URL = import.meta.env.VITE_KRATOS_API_URL

export class MachineService {

    constructor() {
    }

    async FetchMachine(id: number): Promise<Machine> {
        try {
            const res = await fetch(`${KRATOS_API_URL}/api/machine/${id}`);
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


    async FetchRecommendMachine(id: number): Promise<Machine[]> {
        try {
            const res = await fetch(`${KRATOS_API_URL}/api/machine/recommend/${id}`);
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

    async FetchMachines(options?: { page?: number, limit?: number }): Promise<Machine[]> {
        try {
            let params = ""
            if (options) {
                params = fillParamValues(options)
            }
            const res = await fetch(`${KRATOS_API_URL}/api/machine${params}`);
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

    async DeleteMachine(id: number) {
        try {
            const res = await fetch(`${KRATOS_API_URL}/api/machine/${id}`, {
                method: 'delete',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
            });
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            return data;
        } catch (error) {
            console.error('Error creating account:', error);
            throw error;
        }
    }

    async SuggestTime(id: number, vars: {
        desired_date: Date,
        desired_start_time: Time,
        desired_end_time: Time,
    }): Promise<TimeSuggestion> {
        const {
            desired_date,
            desired_start_time,
            desired_end_time,
        } = vars
        try {
            const res = await fetch(`${KRATOS_API_URL}/api/machine/usage/${id}?desired_date=${format(desired_date, "yyyy-MM-dd")}&desired_start_time=${desired_start_time.hour}:${desired_start_time.minute}&desired_end_time=${desired_end_time.hour}:${desired_end_time.minute}`);
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            const prevSugg: [Time, Time] = [data.PrevSuggestion.StartTime, data.PrevSuggestion.EndTime]
            const nextSugg: [Time, Time] = [data.NextSuggestion.StartTime, data.NextSuggestion.EndTime]


            return {
                Previous: [
                    new Time(prevSugg[0].hour, prevSugg[0].minute),
                    new Time(prevSugg[1].hour, prevSugg[1].minute),
                ],
                Next: [
                    new Time(nextSugg[0].hour, nextSugg[0].minute),
                    new Time(nextSugg[1].hour, nextSugg[1].minute),
                ]
            };
        } catch (error) {
            console.error('Error creating account:', error);
            throw error;
        }

    }


}

