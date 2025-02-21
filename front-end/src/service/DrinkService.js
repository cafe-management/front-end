import axios from "axios";
import { API_URL_DRINKS } from "../config/apiConfig";
import { getCloudinaryImageUrl } from "./CloudinaryService";

const API_URL = API_URL_DRINKS;
const token = localStorage.getItem("token");

// Cấu hình headers mặc định
const headers = token
    ? {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    }
    : { "Content-Type": "application/json" };

// 🥤 Lấy danh sách tất cả món ăn
const getDrinks = async () => {
    const response = await axios.get(API_URL, { headers });
    return response.data;
};

// ➕ Thêm món ăn mới
const addDrinks = async (drinkData) => {
    const response = await axios.post(API_URL, drinkData, { headers });
    return response.data;
};

// 🔎 Lấy món ăn theo ID
const getDrinkById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`, { headers });
    return response.data;
};

// 🏷️ Lấy danh sách món ăn theo danh mục
const getDrinksByCategory = async (categoryId) => {
    const response = await axios.get(`${API_URL}/category/${categoryId}`, { headers });
    return response.data;
};

// ❌ Xóa món ăn
const deleteDrink = async (id) => {
    await axios.delete(`${API_URL}/${id}`, { headers });
};

// 🛠️ Cập nhật thông tin món ăn
const updateDrink = async (drink, imageFile) => {
    let updatedDrink = { ...drink };

    // Kiểm tra nếu có ảnh mới thì upload và cập nhật URL ảnh
    if (imageFile) {
        const imageUrl = await getCloudinaryImageUrl(imageFile);
        updatedDrink.imgDrinks = imageUrl;
    }

    await axios.put(`${API_URL}/${updatedDrink.id}`, updatedDrink, { headers });
};



export { getDrinks, getDrinkById, getDrinksByCategory, deleteDrink, updateDrink, addDrinks };
