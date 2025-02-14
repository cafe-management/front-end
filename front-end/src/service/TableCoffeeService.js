import axios from "axios";
import {API_URL_TABLE} from "../config/apiConfig";
const getTableCoffee = async () => {
    try {
        const response = await axios.get(API_URL_TABLE);
        return response.data;
    } catch (error) {
        console.error("Error fetching getTableCoffee:", error);
    }
};
const getTableCoffeeById = async (id) => {
    try {
        const response = await axios.get(`${API_URL_TABLE}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching table coffee by ID:", error);
    }
};

const updateTableCoffeeStatus = async (id, newStatus) => {
    try {
        const response = await axios.put(`${API_URL_TABLE}/${id}/status`, newStatus, {
            headers: { "Content-Type": "application/json" },
        });
        return response.data;
    } catch (error) {
        console.error("Error updating table coffee status:", error);
    }
};

export { getTableCoffee, updateTableCoffeeStatus, getTableCoffeeById};
