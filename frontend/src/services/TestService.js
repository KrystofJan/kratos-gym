import { BaseService } from './base/ApiService';

const getId = async (id) => {
    try {
        const data = await new BaseService().getId(id, "test");
        return data[0];
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

const getAll = async () => {
    try {
        const data = await new BaseService().getAll("test");
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

const post = async (body) => {
    try {
        const data = await new BaseService().post("test", body);
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

export {
    getAll,
    getId,
    post,
}