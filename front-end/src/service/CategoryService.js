import axios from "axios";
import {API_URl_CATEGORY} from "../config/apiConfig";
const getCategories = async ()=>{
    try {
        const response = await axios.get(API_URl_CATEGORY);
        return response.data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}
const getCategoryById = async (id) => {
    try {
        const response = await axios.get(`${API_URl_CATEGORY}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching category with id ${id}:`, error);
        throw error;
    }
};

export {getCategories,getCategoryById}