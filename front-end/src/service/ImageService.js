import axios from "axios";
import {API_URL_IMAGES} from "../config/apiConfig";

const API_URL = API_URL_IMAGES;

const getImages = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching images:", error);
        return [];
    }
};

const getImageById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching image with id ${id}:`, error);
        throw error;
    }
};

const createImage = async (image) => {
    try {
        const response = await axios.post(API_URL, image);
        return response.data;
    } catch (error) {
        console.error("Error creating image:", error);
        throw error;
    }
};

const updateImage = async (id, image) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, image);
        return response.data;
    } catch (error) {
        console.error(`Error updating image with id ${id}:`, error);
        throw error;
    }
};

const deleteImage = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting image with id ${id}:`, error);
        throw error;
    }
};

export { getImages, getImageById, createImage, updateImage, deleteImage };
