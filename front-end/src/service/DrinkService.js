import axios from "axios";
import {API_URL_DRINK} from "../config/apiConfig";


const getDrinks = async ()=>{
    try{
        const response = await axios.get(API_URL_DRINK);
        return response.data;
    }
    catch(error){
        console.error("Error fetching drinks:", error);
    }

}
const getDrinkById = async (id) => {
    try {
        const response = await axios.get(`${API_URL_DRINK}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching drink by id: ", error);
        throw error;
    }
};

const getDrinksByCategory = async (categoryId) => {
    try {
        const response = await axios.get(`${API_URL_DRINK}/category/${categoryId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching drinks by category: ", error);
        throw error;
    }
};
export {getDrinks, getDrinkById, getDrinksByCategory}