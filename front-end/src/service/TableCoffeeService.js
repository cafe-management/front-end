import axios from "axios";
import{API_URL_TABLE_COFFEE} from "../config/apiConfig";

const API_URL = API_URL_TABLE_COFFEE;

const getTableCoffee = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching getTableCoffee:", error);
    }
};
const getTableCoffeeById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching table coffee with id ${id}:`, error);
    }
};

const updateTableCoffeeStatus = async (id, newStatus) => {
    try {
        const response = await axios.put(`${API_URL}/${id}/status`, newStatus, {
            headers: { "Content-Type": "application/json" },
        });
        return response.data;
    } catch (error) {
        console.error("Error updating table coffee status:", error);
    }
};

export { getTableCoffee, updateTableCoffeeStatus,getTableCoffeeById };
