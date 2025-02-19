import axios from "axios";
import {API_URL} from "../config/apiConfig";
const token = localStorage.getItem("token");
const authHeaders = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
}
const getAllEmploy = async () => {
    try {
        const result = await axios.get(`${API_URL}/admin`, {
            headers: authHeaders,
        });
        return result.data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách nhân viên:", error);
        return [];
    }
};

const createEmployee = async (employee) => {
    try {
        const result = await axios.post(`${API_URL}/admin`, employee, {
            headers: authHeaders,
        });
        return result.data;
    } catch (error) {
        console.error("Lỗi khi gửi request:", error.response?.data || error.message);
        return [];
    }
};
const checkAccount = async (email, username) => {
    try {
        const response = await axios.get(API_URL + "/admin/check_account", {
            headers: authHeaders,
            params: {email, username }
        })
        return response.data;
    } catch (error) {
        console.error("Lỗi khi gọi API kiểm tra tài khoản:", error);
        return null;
    }
}
const login = async (username, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { username, password }, {
            headers: {
                "Content-Type": "application/json",
            }
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi đăng nhập:", error);
        return { success: false, message: "Đăng nhập thất bại" };
    }
};

const getUserInfo = async () => {
    const username = localStorage.getItem("username");
    try {
        const response = await axios.get(`${API_URL}/information`, {
            headers: authHeaders,
            params: { username }
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error.response?.data || error.message);
        return null;
    }
};
const updateEmployee = async (id, employee) => {
    try {
        const result = await axios.put(`${API_URL}/${id}`, employee, {
            headers: authHeaders,
        });
        return result.data;
    } catch (error) {
        console.error("Lỗi khi cập nhật nhân viên:", error.response?.data || error.message);
        return [];
    }
};
const changePassword = async (oldPassword, newPassword) => {
    console.log("Gửi request: ", { oldPassword, newPassword });
    try {
        const response = await axios.put(`${API_URL}/login/change-password`,
            { oldPassword, newPassword },
            {
                headers: authHeaders,
            }
        );
        console.log("Response từ backend:", response);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi thay đổi mật khẩu:", error.response?.data?.message || "Có lỗi xảy ra");
        return { success: false, message: error.response?.data?.message || "Có lỗi xảy ra" };
    }
};
export {getAllEmploy, createEmployee, updateEmployee, checkAccount, login, getUserInfo, changePassword};