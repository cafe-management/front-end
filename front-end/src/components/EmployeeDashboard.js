import React, { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { getAllNotifications } from "../service/NotificationService"; // Import service

const EmployeeDashboard = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const socket = new SockJS("http://localhost:8080/ws");
        const stompClient = Stomp.over(socket);
        stompClient.connect({}, () => {
            stompClient.subscribe("/topic/notifications", (message) => {
                if (message.body) {
                    const notification = JSON.parse(message.body);
                    setNotifications((prev) => [notification, ...prev]);
                }
            });
        });
        getAllNotifications()
            .then((data) => setNotifications(data))
            .catch((error) => console.error("Lỗi khi lấy thông báo:", error));

        return () => {
            if (stompClient) {
                stompClient.disconnect();
            }
        };
    }, []);

    return (
        <div>
            <h1>Thông báo cho Nhân Viên</h1>
            <ul>
                {notifications.map((notif, index) => (
                    <li key={index}>
                        {notif.content} - {new Date(notif.dateNote).toLocaleString("vi-VN")}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EmployeeDashboard;
