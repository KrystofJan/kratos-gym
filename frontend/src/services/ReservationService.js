import { BaseService } from './base/ApiService';

const getId = async (id) => {
    try {
        const data = await new BaseService().getId(id, "reservation");
        return data[0];
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

const getAll = async () => {
    try {
        const data = await new BaseService().getAll("reservation");
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}



export {
    getAll,
    getId,
}