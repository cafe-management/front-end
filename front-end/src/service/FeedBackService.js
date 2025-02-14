import axios from "axios";

const API_URL = "http://localhost:8080/api/feedbacks";

const getFeedback = async ()=>{
    try{
        const response = await axios.get(API_URL);
        return response.data;
    }
    catch(error){
        console.error("Error fetching feedback:", error);
        throw error;
    }
}

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

export { getFeedback, getFeedbackById, createFeedback, updateFeedback, deleteFeedback };