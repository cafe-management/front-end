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
        const token = localStorage.getItem("token"); // Giả sử token được lưu trong localStorage
        const result = await axios.post(BASE_URL + "/admins", employee, {
            headers: {
                Authorization: `Bearer ${token}`, // Gửi token kèm theo request
                "Content-Type": "application/json",
            },
        });
        console.log("Phản hồi từ backend:", result.data);
        return result.data;
    } catch (error) {
        console.error("Lỗi khi gửi request:", error.response?.data || error.message);
        return [];
    }
};
const checkAccount = async (email, username) => {
    console.log("Gửi yêu cầu với email:", email, "và username:", username);
    try {
        const response = await axios.get(BASE_URL + "/admins/check_account", {
            params: {email, username }
        })
        console.log("Dữ liệu trả về từ API check account service:", response.data);
        return response.data;
    } catch (error) {
        console.log("Lỗi khi kiểm tra tài khoản, email: ", error);
        return null;
    }
}
const login = async (email, password) => {
    try {
        const response = await axios.post(BASE_URL + "/admins/login", {
            email,
            password
        });
        console.log("Kết quả từ API:", response.data);
        return response.data;
    } catch (error){
        console.error("Lỗi API:", error.response?.data || error.message);
        if (error.response && error.response.status === 400) {
            return error.response.data;  // Ví dụ: { success: false, message: "Sai email hoặc mật khẩu" }
        }
        console.log("Lỗi khi đăng nhập: ", error);
        return null;
    }
}
const updateEmployee = async (id, employee) => {
    try{
        const result = await axios.put(`$BASE_URL/${id}`, employee);
        return result.data;
    } catch (error) {
        console.log(error);
        return [];
    }
}
export {getAllEmploy, createEmployee, updateEmployee, checkAccount, login};