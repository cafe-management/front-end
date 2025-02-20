import axios from "axios";
import{API_URL_DRINKS} from "../config/apiConfig";

const API_URL = API_URL_DRINKS;
const token = localStorage.getItem("token");
const getDrinks = async ()=>{
    try {
        const response = await axios.get(API_URL, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching drinks:", error);
    }
};
 const getDrinkById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching drink by id: ", error);
        throw error;
    }
};

 const getDrinksByCategory = async (categoryId) => {
    try {
        const response = await axios.get(`${API_URL}/category/${categoryId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching drinks by category: ", error);
        throw error;
    }
};
export {getDrinks, getDrinkById, getDrinksByCategory}
