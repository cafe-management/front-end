import axios from "axios";
import {BASE_URL} from "../config/apiConfig"
const TopProduct = async() => {
    try{
        const result = await axios.get(BASE_URL + "/orderDetails/top");
        console.log("Dữ liệu từ API:", result.data);
        return result.data;
    }catch (error){
        return [];
    }
}
const addOrderDetail = async (orderDetail) => {
    try{
        const response = await axios.post(BASE_URL + "/orderDetails", orderDetail);
        return response.data;
    } catch (error){
        console.log("Lỗi khi thêm mới vào giỏ hàng", error.response?.data || error.message);

    }
}
export {TopProduct, addOrderDetail};