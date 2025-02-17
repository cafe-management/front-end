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
    try {
        const response = await axios.post(BASE_URL + "/login", {
            username,
            password
        });
        console.log("Kết quả từ API:", response.data);
        return response.data;

        if (response.data.success) {
            // Sau khi đăng nhập thành công, lấy thông tin người dùng
            const userResponse = await axios.get(BASE_URL + "/user/me", {
                headers: {
                    Authorization: `Bearer ${response.data.token}`  // Giả sử bạn sử dụng token để xác thực
                }
            });

            if (userResponse.data) {
                // Lưu userId vào localStorage
                localStorage.setItem("userId", userResponse.data.id);
            }
    } catch (error){
        console.error("Lỗi API:", error.response?.data || error.message);
        if (error.response && error.response.status === 400) {
            return error.response.data;
        }
        console.log("Lỗi khi đăng nhập: ", error);
        return null;
    }
}

const getUserById = async (id) => {
    if (!id) {
        console.error("❌ Lỗi: ID không hợp lệ");
        return null;
    }

    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("❌ Lỗi: Không tìm thấy token!");
            return null;
        }

        const response = await axios.get(`${BASE_URL}/users/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.data) {
            console.warn("⚠️ API trả về dữ liệu rỗng.");
            return null;
        }

        console.log("✅ Dữ liệu người dùng:", response.data);
        return response.data;
    } catch (error) {
        if (error.response?.status === 401) {
            console.error("❌ Token hết hạn hoặc không hợp lệ, đăng xuất...");
            localStorage.removeItem("token");
        } else if (error.response?.status === 404) {
            console.error("❌ Người dùng không tồn tại!");
        } else {
            console.error("❌ Lỗi khi lấy thông tin người dùng:", error.response?.data || error.message);
        }
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
export {getAllEmploy, createEmployee, updateEmployee, checkAccount, login, getUserById};