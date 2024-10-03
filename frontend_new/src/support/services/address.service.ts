import type { Address } from '../types';


export class AddressService {

    constructor() {
    }
    async CreateAddress(address: Address) {
        try {
            console.log(JSON.stringify(address))
            const res = await fetch(`http://localhost:5173/api/address`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify(address)
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
