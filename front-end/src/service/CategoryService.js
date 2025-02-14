import axios from "axios";
import {API_URl_CATEGORY} from "../config/apiConfig";

const API_URl = "http://localhost:8080/api/categories"

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
        return response.data;
    } catch (error) {
        console.error('Error creating category:', error);
        throw error;
    }
};

const updateCategory = async (id, category) => {
    try {
        return response.data;
    } catch (error) {
        console.error(`Error updating category with id ${id}:`, error);
        throw error;
    }
};

const deleteCategory = async (id) => {
    try {
        return response.data;
    } catch (error) {
        console.error(`Error deleting category with id ${id}:`, error);
        throw error;
    }
}

export {getCategories,getCategoryById,createCategory,updateCategory,deleteCategory}