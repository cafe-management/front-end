import axios from "axios";
import { API_URL_DRINKS } from "../config/apiConfig";
import { getCloudinaryImageUrl } from "./CloudinaryService"; // Đảm bảo rằng bạn đã tạo hàm upload ảnh

const API_URL = API_URL_DRINKS;
const token = localStorage.getItem("token");

// Lấy danh sách tất cả món ăn
const getDrinks = async () => {
    try {
        const response = await axios.get(API_URL, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching drinks:", error);
        throw error;
    }
};

// Lấy món ăn theo ID
const getDrinkById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching drink by id:", error);
        throw error;
    }
};

// Lấy danh sách món ăn theo danh mục
const getDrinksByCategory = async (categoryId) => {
    try {
        const response = await axios.get(`${API_URL}/category/${categoryId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching drinks by category:", error);
        throw error;
    }
};

// Xóa món ăn
const deleteDrink = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting drink:", error);
        throw error;
    }
};

// Cập nhật thông tin món ăn
const updateDrink = async (drink, imageFile) => {
    try {
        let updatedDrink = { ...drink };

        // Kiểm tra nếu có ảnh mới
        if (imageFile) {
            // Upload ảnh mới lên Cloudinary và lấy URL của ảnh
            const imageUrl = await getCloudinaryImageUrl(imageFile);
            updatedDrink.imgDrinks = imageUrl;  // Cập nhật thuộc tính imgDrinks với URL mới
        }

        // Cập nhật món ăn với ảnh mới (nếu có)
        const response = await axios.put(`${API_URL}/${updatedDrink.id}`, updatedDrink, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        return response.data;
    } catch (error) {
        console.error("Error updating drink:", error);
        throw error;
    }
};

export { getDrinks, getDrinkById, getDrinksByCategory, deleteDrink, updateDrink };
