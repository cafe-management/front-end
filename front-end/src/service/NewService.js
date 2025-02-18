import axios from "axios";
import { API_URL_NEWS } from "../config/apiConfig";

const API_URL = API_URL_NEWS;


export const getAllNews = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Lấy thông tin một news theo id
export const getNewsById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Tạo mới một news
export const createNews = async (news) => {
    try {
        const response = await axios.post(API_URL, news);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Cập nhật một news theo id
export const updateNews = async (id, newsDetails) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, newsDetails);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Xóa một news theo id
export const deleteNews = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
