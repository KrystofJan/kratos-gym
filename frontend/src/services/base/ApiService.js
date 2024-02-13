import * as config from '../config/api_config';

export class BaseService{

     async  getId (id, endpoint) {
        try {
            const response = await fetch(`${config.url}/${endpoint}/${id}`);
            const data = await response.json();
            return data[0];
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    
    async getAll (endpoint) {
        try {
            const response = await fetch(`${config.url}/${endpoint}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    async post (endpoint, data) {
        try {
            const requestOptions = config.post_headers;
            requestOptions.body = JSON.stringify(data);
            const response = await fetch(`${config.url}/${endpoint}`, requestOptions);
            return response;;
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
}
