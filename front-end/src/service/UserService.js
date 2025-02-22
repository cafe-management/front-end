import axios from "axios";
import {API_URL} from "../config/apiConfig";
const token = localStorage.getItem("token");
// const authHeaders = {
//     Authorization: `Bearer ${token}`,
//     "Content-Type": "application/json"
// }
const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
    };
};
const getAllEmploy = async () => {
    try {
        const result = await axios.get(`${API_URL}/admin`, {
            headers: getAuthHeaders(),
        });
        return result.data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách nhân viên:", error);
        return [];
    }
}

const createEmployee = async (employee) => {
    console.log("Dữ liệu gửi lên backend", employee);
    console.log("Dữ liệu gửi lên backend json", JSON.stringify(employee, null, 2));
    try {
        const result = await axios.post(`${API_URL}/admin`, employee, {
            headers: getAuthHeaders(),
        });
        console.log("Dữ liệu từ API: ", result);
        return result.data;
    } catch (error) {
        console.error("Lỗi khi gửi request:", error.response?.data || error.message);
        return [];
    }
};
const checkAccount = async (email, username) => {
    try {
        const response = await axios.get(API_URL + "/admin/check_account", {
            headers: getAuthHeaders(),
            params: {email, username }
        })
        return response.data;
    } catch (error) {
        console.error("Lỗi khi gọi API kiểm tra tài khoản:", error);
        return null;
    }
}
const login = async (username, password) => {
    console.log("Dữ liệu gửi đến backend: ", { username, password });
    console.log("Dữ liệu gửi đến backend:", JSON.stringify({ username, password }, null, 2));

    try {
        const response = await axios.post(`${API_URL}/login`, { username, password }, {
            headers: {
                "Content-Type": "application/json",
            }
        });
        console.log("Dữ liệu gửi đến backend:", JSON.stringify({ username, password }, null, 2));

        return response.data;
    } catch (error) {
        console.error("Lỗi khi đăng nhập:", error);
        return { success: false, message: "Đăng nhập thất bại" };
    }
};
const lockAccount = async (accountId) => {
    try {
        const response = await axios.put(`${API_URL}/login/lock/${accountId}`, {}, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi khóa tài khoản:", error.response?.data || error.message);
        return { success: false, message: error.response?.data?.message || "Có lỗi xảy ra" };
    }
};
const getUserInfo = async () => {
    const username = localStorage.getItem("username");
    try {
        const response = await axios.get(`${API_URL}/information`, {
            headers: getAuthHeaders(),
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
            headers: getAuthHeaders(),
        });
        return result.data;
    } catch (error) {
        console.log(error);
        return [];
    }
};
const changePassword = async (oldPassword, newPassword) => {
    const token = localStorage.getItem("token");

    if (!token) {
        console.error("🚫 Không tìm thấy token trong localStorage!");
        return { success: false, message: "Bạn chưa đăng nhập." };
    }

    console.log("🔍 Token gửi lên:", token);
    try {
        const response = await axios.put(`${API_URL}/login/change-password`,
            { oldPassword, newPassword },
            {
                headers: getAuthHeaders(),
            }
        );
        console.log("Response từ backend:", response);
        return response;
    } catch (error) {
        console.error("Lỗi khi thay đổi mật khẩu:", error);
        return { success: false, message: error.response?.data?.message || "Có lỗi xảy ra" };
    }
};
const forgotPassword = async (emailOrUsername) => {
    try {
        const response = await axios.post(`${API_URL}/login/forgot-password`,
            { emailOrUsername },
            {
                headers: {
                    "Content-Type": "application/json",
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Lỗi khi gửi yêu cầu quên mật khẩu:", error);
        return { success: false, message: error.response?.data?.message || "Có lỗi xảy ra" };
    }
};
const verifyOtp = async (emailOrUsername, otp) =>{
    console.log("Dữ liệu gửi lên:", { emailOrUsername, otp });
    try {
        const response = await axios.post(
            `${API_URL}/login/verify-otp`,
            { emailOrUsername, otp }, // ✅ Đúng định dạng DTO
            {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            }
        );
        console.log("Dữ liệu API trả về: ", response.data);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi xác thực OTP: ", error);
        return { success: false, message: error.response?.data?.message || "Có lỗi xảy ra" };
    }
};
const resetPassword = async (emailOrUsername, otp, newPassword) => {
    console.log("Email or User", emailOrUsername, otp, newPassword);
    try{
        const response = await axios.put(`${API_URL}/login/reset-password`,
            {emailOrUsername, otp, newPassword},
            {
                headers: {"Content-Type": "application/json"}
            }
            );
        return response.data;
    }catch(error){
        console.error("Lỗi khi đặt lại mật khẩu", error);
        return {success: false, message: error.response?.data?.message || "Có lỗi xảy ra"}
    }
}
export {getAllEmploy, createEmployee, updateEmployee, checkAccount, login, getUserInfo, changePassword, forgotPassword, verifyOtp, resetPassword, lockAccount};