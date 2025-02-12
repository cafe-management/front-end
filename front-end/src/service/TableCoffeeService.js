import axios from "axios";

const API_URL = "http://localhost:8080/api/tableCoffee"
const getTableCoffee = async ()=>{
    try{
        const response = await axios.get(API_URL);
        return response.data;
    }
    catch(error){
        console.error("Error fetching getTableCoffee:", error);
    }
}

export{getTableCoffee}