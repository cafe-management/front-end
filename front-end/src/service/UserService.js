import axios from "axios";
import {BASE_URL} from "../config/apiConfig";

const getAllEmploy = async () => {
    try{
        const result = await axios.get(BASE_URL + "/admins");
        return result.data;
    } catch (error) {
        return [];
    }
}
const createEmployee = async (employee) => {
    console.log("Dữ liệu gửi lên backend", employee);
    console.log("Dữ liệu gửi lên backend json", JSON.stringify(employee, null, 2));
    try {
        const token = localStorage.getItem("token");
        const result = await axios.post(BASE_URL + "/admins", employee, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        return result.data;
    } catch (error) {
        console.error("Lỗi khi gửi request:", error.response?.data || error.message);
        return [];
    }
};
const checkAccount = async (email, username) => {
    try {
        const response = await axios.get(BASE_URL + "/admins/check_account", {
            params: {email, username }
        })
        return response.data;
    } catch (error) {
        return null;
    }
}
const login = async (username, password) => {
    console.log("Dữ liệu gửi đến backend: ", { username, password });
    try {
        const response = await axios.post(BASE_URL + "/login", {
            username, // Đổi key cho khớp với backend
            password
        });

        console.log("Kết quả từ API:", response.data);
        localStorage.setItem("username", username);
        return response.data;
    } catch (error){
        console.error("Lỗi API:", error.response?.data || error.message);
        if (error.response && error.response.status === 400) {
            console.log("Lỗi chi tiết từ backend:", error.response.data);
            return error.response.data;
        }
        return null;
    }
};

const getUserInfo = async () => {
    const username = localStorage.getItem("username");
    console.log("Username in getUserInfo", username);
    console.log("Username in get", username);
    try {
        const response = await axios.get(`${BASE_URL}/information`, {
            params: { username }
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        return null;
    }
};

const updateEmployee = async (id, employee) => {
    try{
        const result = await axios.put(`$BASE_URL/${id}`, employee);
        return result.data;
    } catch (error) {
        console.log(error);
        return [];
    }
}
const changePassword = async (userId, oldPassword, newPassword) => {
    try {
        const response = await axios.put(`${BASE_URL}/${userId}/change-password`, {
            oldPassword,
            newPassword
        });

        return response.data;
    } catch (error) {
        console.error("Lỗi khi thay đổi mật khẩu:", error);
        return { success: false, message: error.response?.data?.message || "Có lỗi xảy ra" };
    }
};
export {getAllEmploy, createEmployee, updateEmployee, checkAccount, login, getUserInfo, changePassword};