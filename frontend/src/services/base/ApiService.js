import * as config from '@/services/config/api_config';

export class BaseService{

    constructor(endpoint, supportEndpoint = null) {
        this.endpoint = endpoint;
        this.supportEndpoint = supportEndpoint
    }

     async  baseGetId (id) {
        try {
            const response = await fetch(`${config.url}/${this.endpoint}/${id}`);
            const data = await response.json();

            return data;
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    async  baseGetIdWithSupportEndpoint (id) {
        try {
            const response = await fetch(`${config.url}/${this.supportEndpoint}/${id}/${this.endpoint}`);
            const data = await response.json();

            return data;
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    
    async baseGetAll () {
        try {
            const response = await fetch(`${config.url}/${this.endpoint}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    async basePost (data) {
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
