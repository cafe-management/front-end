import axios from "axios";

const API_URL = "http://localhost:8080/api/drinks"
const getDrinks = async ()=>{
    try{
        const response = await axios.get(API_URL);
        return response.data;
    }
    catch(error){
        console.error("Error fetching drinks:", error);
    }

}
 const getDrinkById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching drink by id: ", error);
        throw error;
    }
};

 const getDrinksByCategory = async (categoryId) => {
    try {
        const response = await axios.get(`${API_URL}/category/${categoryId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching drinks by category: ", error);
        throw error;
    }
};
export {getDrinks, getDrinkById, getDrinksByCategory}
