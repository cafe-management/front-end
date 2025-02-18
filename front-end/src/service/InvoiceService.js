// src/services/InvoiceService.js
import axios from "axios";
import { API_URL_INVOICE } from "../config/apiConfig";


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
        // Endpoint: PUT /api/invoices/{invoiceId}/cart/{cartId}
        const response = await axios.put(`${API_URL_INVOICE}/${invoiceId}/cart/${cartId}`);
        return response.data;
    } catch (error) {
        console.error(`Error assigning invoice ${invoiceId} to cart ${cartId}:`, error);
        throw error;
    }
};

export {
    createInvoice,
    assignInvoiceToCart
};
