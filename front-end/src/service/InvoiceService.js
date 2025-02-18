// src/services/InvoiceService.js

import axios from "axios";
import { API_URL_INVOICE } from "../config/apiConfig";


const getInvoices = async () => {
    try {
        const response = await axios.get(API_URL_INVOICE);
        return response.data;
    } catch (error) {
        console.error("Error fetching invoices:", error);
        throw error;
    }
};

// Lấy invoice theo ID
const getInvoiceById = async (id) => {
    try {
        const response = await axios.get(`${API_URL_INVOICE}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching invoice with id ${id}:`, error);
        throw error;
    }
};

// Tạo mới invoice
const createInvoice = async (invoice) => {
    try {
        const response = await axios.post(API_URL_INVOICE, invoice);
        return response.data;
    } catch (error) {
        console.error("Error creating invoice:", error);
        throw error;
    }
};

// Cập nhật invoice theo ID
const updateInvoice = async (id, invoice) => {
    try {
        const response = await axios.put(`${API_URL_INVOICE}/${id}`, invoice);
        return response.data;
    } catch (error) {
        console.error(`Error updating invoice with id ${id}:`, error);
        throw error;
    }
};

// Xóa invoice theo ID
const deleteInvoice = async (id) => {
    try {
        const response = await axios.delete(`${API_URL_INVOICE}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting invoice with id ${id}:`, error);
        throw error;
    }
};

export { getInvoices, getInvoiceById, createInvoice, updateInvoice, deleteInvoice };
