import axios from "axios";

const API_URL = "http://10.10.8.75:8080/api/cartItems";

const getAllCartItems = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching cart items:", error);
    }
};

const getCartItemById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching cart item with id ${id}:`, error);
    }
};

const createCartItem = async (cartItem) => {
    try {
        const response = await axios.post(API_URL, cartItem, {
            headers: { "Content-Type": "application/json" },
        });
        return response.data;
    } catch (error) {
        console.error("Error creating cart item:", error);
    }
};

// Cập nhật thông tin CartItem theo id
const updateCartItem = async (id, cartItem) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, cartItem, {
            headers: { "Content-Type": "application/json" },
        });
        return response.data;
    } catch (error) {
        console.error(`Error updating cart item with id ${id}:`, error);
    }
};

// Xóa CartItem theo id
const deleteCartItem = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting cart item with id ${id}:`, error);
    }
};
const TopProduct = async() => {
    try{
        const result = await axios.get(API_URL + "/top");
        console.log("Dữ liệu từ API:", result.data);
        return result.data;
    }catch (error){
        return [];
    }
}
export { getAllCartItems, getCartItemById, createCartItem, updateCartItem, deleteCartItem,TopProduct };
