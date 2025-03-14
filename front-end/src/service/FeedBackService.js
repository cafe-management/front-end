import axios from "axios";
import{API_URL_FEEDBACK} from "../config/apiConfig";

const API_URL = API_URL_FEEDBACK;

const getFeedback = async (page = 0, size = 10) => {
    try {
        const response = await axios.get(API_URL, {
            params: { page, size }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching feedback:", error);
        throw error;
    }
};

const getFeedbackById = async (id)=>{
    try{
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    }
    catch(error){
        console.error("Error fetching feedback by ID:", error);
        throw error;
    }
}

const createFeedback = async (feedbackData)=>{
    try{
        const response = await axios.post(API_URL, feedbackData);
        return response.data;
    }
    catch(error){
        console.error("Error creating feedback:", error);
        throw error;
    }
}

const updateFeedback = async (id, feedbackData)=>{
    try{
        const response = await axios.put(`${API_URL}/${id}`, feedbackData);
        return response.data;
    }
    catch(error){
        console.error("Error updating feedback:", error);
        throw error;
    }
}

const deleteFeedback = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting feedback with id ${id}:`, error);
        throw error;
    }
};

const searchFeedbackByDate = async (date, page = 0, size = 10) => {
    try {
        const response = await axios.get(`${API_URL}/search`, {
            params: { date, page, size }
        });
        return response.data;
    } catch (error) {
        console.error("Error searching feedback by date:", error);
        throw error;
    }
};

export { getFeedback, getFeedbackById, createFeedback, updateFeedback, deleteFeedback,searchFeedbackByDate};