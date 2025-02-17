import axios from "axios";
import {API_URL_CART} from "../config/apiConfig";

const API_URL = API_URL_CART;

const getAllCarts = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching carts:", error);
    }
};

const getCartById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching cart with id ${id}:`, error);
    }
};

const createCart = async (cart) => {
    try {
        const response = await axios.post(API_URL, cart, {
            headers: { "Content-Type": "application/json" },
        });
        return response.data;
    } catch (error) {
        console.error("Error creating cart:", error);
    }
};

const updateCart = async (id, cart) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, cart, {
            headers: { "Content-Type": "application/json" },
        });
        return response.data;
    } catch (error) {
        console.error(`Error updating cart with id ${id}:`, error);
    }
};

const deleteCart = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting cart with id ${id}:`, error);
    }
};

const getCartByTableId = async (tableId) => {
    try {
        const response = await axios.get(`${API_URL}/by-table/${tableId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching cart for table id ${tableId}:`, error);
        throw error;
    }
};

export { getAllCarts, getCartById, createCart, updateCart, deleteCart,getCartByTableId };
