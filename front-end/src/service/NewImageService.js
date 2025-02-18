import axios from "axios";
import { API_URL_NEWS_IMAGES } from "../config/apiConfig";

const API_URL = API_URL_NEWS_IMAGES;

// Lấy danh sách tất cả các ảnh
export const getAllImages = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Lấy thông tin một ảnh theo id
export const getImageById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Tạo mới một ảnh
export const createImage = async (imageNews) => {
    try {
        const response = await axios.post(API_URL, imageNews);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Cập nhật thông tin một ảnh
export const updateImage = async (id, imageNewsDetails) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, imageNewsDetails);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Xóa một ảnh theo id
export const deleteImage = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
