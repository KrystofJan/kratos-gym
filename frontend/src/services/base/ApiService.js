import * as config from '@/services/config/api_config';

export class BaseService{

    constructor(endpoint) {
        this.endpoint = endpoint;
    }

     async  getId (id) {
        try {
            const response = await fetch(`${config.url}/${this.endpoint}/${id}`);
            const data = await response.json();
            return data[0];
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    
    async getAll () {
        try {
            const response = await fetch(`${config.url}/${this.endpoint}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    async post (data) {
        try {
            const requestOptions = config.post_headers;
            requestOptions.body = JSON.stringify(data);
            const response = await fetch(`${config.url}/${this.endpoint}`, requestOptions);
            return response;;
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
}
