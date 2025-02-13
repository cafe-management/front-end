import axios from "axios";

const API_URL = "http://localhost:8080/api/tableCoffee";

const getTableCoffee = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching getTableCoffee:", error);
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

export { getTableCoffee, updateTableCoffeeStatus };
