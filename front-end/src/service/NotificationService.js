import axios from "axios";
import{API_URL_NOTIFICATIONS} from "../config/apiConfig";

const API_URl = API_URL_NOTIFICATIONS;

const getAllNotifications = async ()=>{
    try{
        const response = await axios.get(API_URl);
        return response.data;
    }
    catch(error){
        console.error("Error fetching notifications:", error.message);
        return [];
    }
}

const getNotificationById = async (id)=>{
    try{
        const response = await axios.get(`${API_URl}/${id}`);
        return response.data;
    }
    catch(error){
        console.error("Error fetching notification by ID:", error.message);
        return null;
    }
}

const createNotification = async (notificationData)=>{
    try {
        const response = await axios.post(`${API_URl}/send`, notificationData, {
            headers: { "Content-Type": "application/json" },
        });
        return response.data;
    } catch (error) {
        console.error("Error creating notification:", error);
    }
}

const deleteNotification = async (id)=>{
    try{
        const response = await axios.delete(`${API_URl}/${id}`);
        return response.data;
    }
    catch(error){
        console.error("Error deleting notification by ID:", error.message);
        return null;
    }
}

export { getAllNotifications, getNotificationById, createNotification, deleteNotification };