// src/services/InvoiceService.js
import axios from "axios";
import { API_URL_INVOICE } from "../config/apiConfig";

const getAllInvoice = async (page = 0, size = 5) => {
    try {
        const response = await axios.get(API_URL_INVOICE, {
            params: { page, size }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching invoices:", error);
        throw error;
    }
};

const createInvoice = async (invoice) => {
    try {
        const response = await axios.post(API_URL_INVOICE, invoice);
        return response.data;
    } catch (error) {
        console.error("Error creating invoice:", error);
        throw error;
    }
};

// Gán hóa đơn cho giỏ hàng (Assign Invoice to Cart)
const assignInvoiceToCart = async (invoiceId, cartId) => {
    try {
        const response = await axios.put(`${API_URL_INVOICE}/${invoiceId}/cart/${cartId}`);
        return response.data;
    } catch (error) {
        console.error(`Error assigning invoice ${invoiceId} to cart ${cartId}:`, error);
        throw error;
    }
};

export {
    createInvoice,
    assignInvoiceToCart,
    getAllInvoice
};
