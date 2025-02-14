import axios from "axios";
import {API_URL_CART} from "../config/apiConfig";
// Lấy danh sách tất cả các Cart
const getAllCarts = async () => {
    try {
        const response = await axios.get(API_URL_CART);
        return response.data;
    } catch (error) {
        console.error("Error fetching carts:", error);
    }
};
// Lấy thông tin một Cart theo id
const getCartById = async (id) => {
    try {
        const response = await axios.get(`${API_URL_CART}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching cart with id ${id}:`, error);
    }
};

// Tạo mới một Cart
const createCart = async (cart) => {
    try {
        const response = await axios.post(API_URL_CART, cart, {
            headers: { "Content-Type": "application/json" },
        });
        return response.data;
    } catch (error) {
        console.error("Error creating cart:", error);
    }
};

// Cập nhật thông tin Cart theo id
const updateCart = async (id, cart) => {
    try {
        const response = await axios.put(`${API_URL_CART}/${id}`, cart, {
            headers: { "Content-Type": "application/json" },
        });
        return response.data;
    } catch (error) {
        console.error(`Error updating cart with id ${id}:`, error);
    }
};

// Xóa Cart theo id
const deleteCart = async (id) => {
    try {
        const response = await axios.delete(`${API_URL_CART}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting cart with id ${id}:`, error);
    }
};

export { getAllCarts, getCartById, createCart, updateCart, deleteCart };