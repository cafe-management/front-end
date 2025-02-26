import  axios from "axios";
import { API_URL_NEWS } from "../config/apiConfig";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = API_URL_NEWS;
const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");
    return {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
    };
};

    export const getAllNews = async () => {
    try {
        const username = localStorage.getItem("username");
        const role = localStorage.getItem("role");
        const response = await axios.get(API_URL, {
            headers: getAuthHeaders(),
            params: { username, role }
        });
        return response.data;
    } catch (error) {
        toast.error("⚠️ Lỗi khi tải danh sách tin tức!");
        throw error;
    }
};

export const getNewsById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        toast.error("⚠️ Lỗi khi tải thông tin bài tin!");
        throw error;
    }
};

// Tạo mới một tin tức
export const createNews = async (news) => {
    try {
        const username = localStorage.getItem("username");
        const role = localStorage.getItem("role");
        const newsData = {
            ...news,
            createdBy: username,
            status: role === "admin" ? "APPROVED" : "PENDING",
        };
        const response = await axios.post(API_URL, newsData,{
            headers: getAuthHeaders(),
        });
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
        const role = localStorage.getItem("role");
        const username = localStorage.getItem("username");
        if (role !== "admin" && role !== "employ") {
            toast.error("⛔ Bạn không có quyền cập nhật bài viết này!");
            return;
        }
        const response = await axios.put(`${API_URL}/${id}?username=${username}&role=${role}`, newsDetails, {
            headers: getAuthHeaders(),
        });
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
        const role = localStorage.getItem("role");
        if (role !== "admin" && role!=="employ") {
            toast.error("⛔ Bạn không có quyền xóa bài viết!");
            return;
        }
        await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
        toast.error("❌ Lỗi khi xóa tin tức!");
        throw error;
    }
};
export const approveNews = async (id) => {
    try {
        const role = localStorage.getItem("role");
        if (role !== "admin") {
            toast.error("⛔ Bạn không có quyền duyệt bài viết!");
            return;
        }
        const response = await axios.put(`${API_URL}/${id}/approve`, {}, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        toast.error("❌ Lỗi khi duyệt bài viết!");
        throw error;
    }
};
export const getPendingNews = async () => {
    try {
        const response = await axios.get(`${API_URL}/pending`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        toast.error("⚠️ Lỗi khi tải danh sách tin tức đang chờ duyệt!");
        throw error;
    }
};
export const rejectNews = async (id) => {
    try {
        const response = await axios.put(`${API_URL}/${id}/reject`,{},
            {
                headers: getAuthHeaders(),
            });
            return response.data;
    } catch (error) {
        console.error("Lỗi từ chối bài viết:", error);
        throw error;
    }
};

export const updateNewsStatus = async (id, status) => {
    try {
        const response = await axios.put(`${API_URL}/${id}/status`, { status }, {
            headers: getAuthHeaders(),
        });
        toast.success("✅ Cập nhật trạng thái thành công!");
        return response.data;
    } catch (error) {
        toast.error("❌ Lỗi khi cập nhật trạng thái bài viết!");
        throw error;
    }
};
