
const API_NINJAS_KEY = import.meta.env.VITE_API_NINJAS

export class APINinjasService {

    constructor() {
    }
    async GetQuote() {
        try {
            const res = await fetch(`https://api.api-ninjas.com/v1/quotes?category=fitness`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    "X-Api-Key": API_NINJAS_KEY
                },
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

}
