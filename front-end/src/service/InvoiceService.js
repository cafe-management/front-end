import axios from "axios";

const API_URL = "http://localhost:8080/api/invoice";

const getInvoice = async ()=>{
    try {
        const invoice = await axios.get(API_URL);
        return invoice.data;
    } catch (error) {
        console.error('Error fetching invoice:', error);
    }
}


export {getInvoice}