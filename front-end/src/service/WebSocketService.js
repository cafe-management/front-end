import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const SOCKET_URL = "http://localhost:8080/ws"; // Địa chỉ WebSocket từ Backend

let stompClient = null;

// Kết nối WebSocket cho người dùng
export const connectWebSocketUser = (onMessageReceived) => {
    const socket = new SockJS(SOCKET_URL);
    stompClient = new Client({
        webSocketFactory: () => socket,
        debug: (str) => console.log(str),
        onConnect: () => {
            console.log(" có tin tức mới ");
            stompClient.subscribe("/topic/news", (message) => {
                if (onMessageReceived) {
                    onMessageReceived(message.body);
                }
            });
        },
        onStompError: (frame) => {
            console.error("❌ Lỗi WebSocket:", frame);
        }
    });

    stompClient.activate();
};

export const connectWebSocketEmployee = (onMessageReceived) => {
    const socket = new SockJS(SOCKET_URL);
    stompClient = new Client({
        webSocketFactory: () => socket,
        debug: (str) => console.log(str),
        onConnect: () => {
            console.log("✅ Kết nối WebSocket cho nhân viên!");
            stompClient.subscribe("/topic/notifications", (message) => {
                if (onMessageReceived) {
                    onMessageReceived(message.body);
                }
            });
        },
        onStompError: (frame) => {
            console.error("❌ Lỗi WebSocket:", frame);
        }
    });

    stompClient.activate();
};

export const disconnectWebSocket = () => {
    if (stompClient) {
        stompClient.deactivate();
    }
};
