import axios from "axios";
import {BASE_URL} from "../config/apiConfig"
const OrderDetailService = async() => {
    try{
        const result = await axios.get(BASE_URL + "/order_detail/top");
        console.log("Dữ liệu từ API:", result.data);
        return result.data;
    }catch (error){
        return [];
    }
}
export default OrderDetailService;