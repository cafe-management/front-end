import axios from "axios";
import {API_URL, BASE_URL} from "../config/apiConfig";

const createCartItem = async (cartItem) => {
    try {
        const response = await axios.post(API_URL, cartItem, {
            headers: { "Content-Type": "application/json" },
        });
        console.log("Dữ liệu:" + response.data);
        return response.data;
    } catch (error) {
        console.error("Error creating cart item:", error);
    }
};
const TopProduct = async() => {
    try{
        const result = await axios.get(BASE_URL + "/orderDetails/top");
        console.log("Dữ liệu từ API:", result.data);
        return result.data;
    }catch (error){
        return [];
    }
}
export {createCartItem, TopProduct};