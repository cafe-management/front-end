import axios from "axios";
import{API_URL_CUSTOMER} from "../config/apiConfig";

const API_URL = API_URL_CUSTOMER;

const getCustomers = async ()=>{
    try{
        const response =  await axios.get(API_URL)
        return response.data
    }
    catch(error){
        console.error("Error fetching customers:", error)
        return []
    }
}

const getCustomerById = async (id)=>{
    try{
        const response = await axios.get(`${API_URL}/${id}`)
        return response.data
    }
    catch(error){
        console.error("Error fetching customer by id:", error)
        return null
    }
}

const createCustomer = async (customer) => {
    try {
        const response = await axios.post(API_URL, customer);
        return response.data;
    } catch (error) {
        console.error("Error creating customer:", error);
        throw error;
    }
};

const updateCustomer = async (id, customer) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, customer);
        return response.data;
    } catch (error) {
        console.error(`Error updating customer with id ${id}:`, error);
        throw error;
    }
};

const deleteCustomer = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting customer with id ${id}:`, error);
        throw error;
    }
};

export { getCustomers, getCustomerById, createCustomer, updateCustomer, deleteCustomer };
