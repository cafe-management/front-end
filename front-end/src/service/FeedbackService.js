import axios from "axios";
import {BASE_URL} from "../config/apiConfig"
const getAllFeedbacks = async () => {
    try{
        const result = await axios.get(BASE_URL + "/feedbacks");
        return result.data;
    } catch (error) {
        return [];
    }
}
export {getAllFeedbacks};