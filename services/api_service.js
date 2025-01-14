const axios = require('axios');

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001/api';

class ApiService {
    static async getCities() {
        const response = await axios.get(`${API_BASE_URL}/scuole/citta`);
        return response.data;
    }

    static async getSchoolsByCity(city) {
        const response = await axios.get(`${API_BASE_URL}/scuole/${city}`);
        return response.data;
    }

    static async getMachinesBySchoolAndFloor(schoolId, floor) {
        const response = await axios.get(`${API_BASE_URL}/macchinette/info/${schoolId}/${floor}`);
        return response.data;
    }

    static async addSchool(schoolData) {
        const response = await axios.post(`${API_BASE_URL}/new/school`, schoolData);
        return response.data;
    }

    static async addMachine(machineData) {
        const response = await axios.post(`${API_BASE_URL}/new/machine`, machineData);
        return response.data;
    }

    static async deleteMachine(machineId) {
        const response = await axios.delete(`${API_BASE_URL}/delete/${machineId}`);
        return response.data;
    }
}

module.exports = ApiService;