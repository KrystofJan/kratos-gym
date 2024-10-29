import type { Reservation } from '../types';

const KRATOS_API_URL = import.meta.env.VITE_KRATOS_API_URL

export class ReservationService {

    constructor() {
    }

    async FetchReservationsByAddressId(accountId: number): Promise<Reservation[]> {
        try {
            const res = await fetch(`${KRATOS_API_URL}/api/account/${accountId}/reservations`);
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

    async FetchReservation(reservationId: number): Promise<Reservation> {
        try {
            const res = await fetch(`${KRATOS_API_URL}/api/reservation/${reservationId}`);
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
