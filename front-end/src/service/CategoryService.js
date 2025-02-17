import axios from "axios";
import{API_URL_CATEGORY} from "../config/apiConfig";

const API_URl = API_URL_CATEGORY;

const getCategories = async ()=>{
    try {
        const response = await axios.get(API_URl);
        return response.data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}
const getCategoryById = async (id) => {
    try {
        const response = await axios.get(`${API_URl}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching category with id ${id}:`, error);
        throw error;
    }
};

const createCategory = async (category) => {
    try {
        const response = await axios.post(API_URl, category);
        return response.data;
    } catch (error) {
        console.error('Error creating category:', error);
        throw error;
    }
};

const updateCategory = async (id, category) => {
    try {
        const response = await axios.put(`${API_URl}/${id}`, category);
        return response.data;
    } catch (error) {
        console.error(`Error updating category with id ${id}:`, error);
        throw error;
    }
};

const deleteCategory = async (id) => {
    try {
        const response = await axios.delete(`${API_URl}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting category with id ${id}:`, error);
        throw error;
    }
}

export {getCategories,getCategoryById,createCategory,updateCategory,deleteCategory}
