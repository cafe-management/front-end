import axios from "axios";
import { API_URL_NEWS } from "../config/apiConfig";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = API_URL_NEWS;


    export const getAllNews = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        toast.error("⚠️ Lỗi khi tải danh sách tin tức!");
        throw error;
    }
};

export const getNewsById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        toast.error("⚠️ Lỗi khi tải thông tin bài tin!");
        throw error;
    }
};

// Tạo mới một tin tức
export const createNews = async (news) => {
    try {
        const response = await axios.post(API_URL, news);
        toast.success("✅ Tin tức đã được tạo thành công!");
        return response.data;
    } catch (error) {
        toast.error("❌ Lỗi khi tạo tin tức!");
        throw error;
    }
};

// Cập nhật một tin tức
export const updateNews = async (id, newsDetails) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, newsDetails);
        toast.success("✏️ Tin tức đã được cập nhật!");
        return response.data;
    } catch (error) {
        toast.error("❌ Lỗi khi cập nhật tin tức!");
        throw error;
    }
};

// Xóa một tin tức
export const deleteNews = async (id) => {
    try {
        await axios.delete(`${API_URL}/${id}`);
        toast.success("🗑️ Tin tức đã được xóa!");
    } catch (error) {
        toast.error("❌ Lỗi khi xóa tin tức!");
        throw error;
    }
};
