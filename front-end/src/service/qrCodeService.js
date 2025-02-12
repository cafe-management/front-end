import axios from "axios";

const API_URL= "http://localhost:8080/api/qrCode"

const getQrCode = async()=>{
    try{
        const response = await axios.get(API_URL)
        return response.data
    }
    catch(error){
        console.error(error)
    }
}
const getQRCodeById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching QR Code with id ${id}:`, error);
        throw error;
    }
};

const deleteQRCode = async (id) => {
    try {
        await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
        console.error(`Error deleting QR Code with id ${id}:`, error);
        throw error;
    }
};
const getTableCoffeeByQRCodeId = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}/tableCoffee`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching TableCoffee for QR Code with id ${id}:`, error);
        throw error;
    }
};

export {getQrCode,getQRCodeById,getTableCoffeeByQRCodeId,deleteQRCode}
