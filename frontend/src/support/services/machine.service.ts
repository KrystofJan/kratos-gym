import type { Machine, TimeSuggestion, MachinePost } from '@/support';
import { fillParamValues } from '../request-utils';
import { Time } from "@internationalized/date";
import { format } from 'date-fns';

const KRATOS_API_URL = import.meta.env.VITE_KRATOS_API_URL

// TODO: UPDATE AND CALL IT IN THE ADMIN FORM COMPONENT
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
        amount_of_people: number,
        can_disturb: boolean
    }): Promise<TimeSuggestion> {
        const {
            desired_date,
            desired_start_time,
            desired_end_time,
            amount_of_people,
            can_disturb
        } = vars
        try {
            const res = await fetch(`${KRATOS_API_URL}/api/machine/usage/${id}?desired_date=${format(desired_date, "yyyy-MM-dd")}&desired_start_time=${desired_start_time.hour}:${desired_start_time.minute}&desired_end_time=${desired_end_time.hour}:${desired_end_time.minute}&amount_of_people=${amount_of_people}&can_disturb=${can_disturb}`);

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            const prevSugg: [Time, Time] = [data.PrevSuggestion.StartTime, data.PrevSuggestion.EndTime]
            const nextSugg: [Time, Time] = [data.NextSuggestion.StartTime, data.NextSuggestion.EndTime]

            return {
                Previous: {
                    time: [
                        new Time(prevSugg[0].hour, prevSugg[0].minute),
                        new Time(prevSugg[1].hour, prevSugg[1].minute),
                    ],
                    isColiding: data.PrevSuggestion.isColiding
                },
                Next: {
                    time: [
                        new Time(nextSugg[0].hour, nextSugg[0].minute),
                        new Time(nextSugg[1].hour, nextSugg[1].minute),
                    ],
                    isColiding: data.NextSuggestion.isColiding
                }

            };
        } catch (error) {
            console.error('Error creating account:', error);
            throw error;
        }

    }

    async CreateMachine(machine: MachinePost) {
        try {
            const res = await fetch(`${KRATOS_API_URL}/api/machine`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify(machine)
            });
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            return data;
        } catch (error) {
            console.error('Error creating address:', error);
            throw error;
        }
    }

    async UpdateMachine(machine: Partial<Machine>, machineId: number) {
        if (!machine) {
            throw new Error("Cannot update account because the request body is not working")
        }

        try {
            const res = await fetch(
                `${KRATOS_API_URL}/api/machine/${machineId}/`,
                {
                    method: "PATCH",
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: JSON.stringify(machine)
                }
            );
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            return data;
        } catch (error) {
            console.error(error)
            throw error
        }
    }
}

