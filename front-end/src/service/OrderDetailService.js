import axios from "axios";

const API_URL = "http://localhost:8080/api/orderDetails";

const addOrderDetail = async (orderDetail) => {
    try {
        const response = await axios.post(API_URL, orderDetail);
        return response.data;
    } catch (error) {
        console.error("Error adding order detail:", error);
    }
};

export { addOrderDetail };