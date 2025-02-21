import React, { useEffect, useMemo, useState } from "react";
import {AppBar, Toolbar, Button, Box, IconButton, Menu, MenuItem, Badge} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { AccountCircle, Notifications as NotificationsIcon } from "@mui/icons-material";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { Howl } from "howler";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAllNotifications, markAllNotificationsAsSeen } from "../service/NotificationService";
import { API_URL_SOCKET } from "../config/apiConfig";

const EmployeeDashBoard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [notifications, setNotifications] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);

    const isProfileMenuOpen = Boolean(anchorEl);
    const isNotificationMenuOpen = Boolean(notificationAnchorEl);

    const notificationSound = useMemo(
        () =>
            new Howl({
                src: ["/notification-alert-269289.mp3"],
                volume: 0.5,
            }),
        []
    );

    useEffect(() => {
        const socket = new SockJS(API_URL_SOCKET);
        const stompClient = Stomp.over(socket);
        stompClient.connect({}, () => {
            stompClient.subscribe("/topic/notifications", (message) => {
                if (message.body) {
                    const notification = JSON.parse(message.body);
                    setNotifications((prev) => [{ ...notification, seen: false }, ...prev]);
                    notificationSound.play();
                    toast.info(notification.content, {
                        position: "bottom-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });
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
    }, [notificationSound]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
    };

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleNotificationMenuOpen = (event) => {
        setNotificationAnchorEl(event.currentTarget);
    };

    const handleNotificationMenuClose = async () => {
        setNotificationAnchorEl(null);
        try {
            await markAllNotificationsAsSeen();
            setNotifications((prev) =>
                prev.map((notif) => ({ ...notif, seen: true }))
            );
        } catch (error) {
            console.error("Error marking notifications as seen:", error);
        }
    };

    // Hàm xác định active style dựa trên đường dẫn hiện tại
    const getButtonStyle = (path) => ({
        fontWeight: "bold",
        textTransform: "uppercase",
        color: location.pathname === path ? "#fff" : "white",
        padding: "8px 16px",
        backgroundColor: location.pathname === path ? "#E7B45A" : "transparent",
        "&:hover": {
            backgroundColor: "#E7B45A",
            color: "#fff",
            boxShadow: "0px 6px 12px rgba(231, 180, 90, 0.8)",
        }
    });

    const renderProfileMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            keepMounted
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            open={isProfileMenuOpen}
            onClose={handleMenuClose}
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    mt: 1,
                    minWidth: 150,
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)"
                }
            }}
        >
            <MenuItem
                onClick={() => {
                    handleMenuClose();
                    navigate("/information");
                }}
                sx={{ py: 1 }}
            >
                Thông Tin Cá Nhân
            </MenuItem>
            <MenuItem onClick={handleLogout} sx={{ py: 1 }}>
                Đăng Xuất
            </MenuItem>
        </Menu>
    );

    const renderNotificationMenu = (
        <Menu
            anchorEl={notificationAnchorEl}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            keepMounted
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            open={isNotificationMenuOpen}
            onClose={handleNotificationMenuClose}
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    mt: 1,
                    minWidth: 250,
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)"
                }
            }}
        >
            {notifications.length === 0 ? (
                <MenuItem onClick={handleNotificationMenuClose} sx={{ py: 1 }}>
                    Không có thông báo
                </MenuItem>
            ) : (
                notifications.map((notif, index) => (
                    <MenuItem
                        key={index}
                        onClick={handleNotificationMenuClose}
                        sx={{
                            py: 1,
                            color: notif.seen ? "gray" : "inherit"
                        }}
                    >
                        {notif.content} -{" "}
                        {new Date(notif.dateNote).toLocaleString("vi-VN")}
                    </MenuItem>
                ))
            )}
        </Menu>
    );

    return (
        <>
            <AppBar
                position="fixed"
                sx={{
                    backgroundColor: "#333",
                    width: "100%",
                    boxShadow: "none"
                }}
            >
                <Toolbar
                    sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        width: "100%",
                        maxWidth: "1200px",
                        margin: "0 auto"
                    }}
                >
                    <Box sx={{ display: "flex", gap: 2 }}>
                        <Button
                            sx={getButtonStyle("/manager/feedback")}
                            onClick={() => navigate("/manager/feedback")}
                        >
                            Phản hồi
                        </Button>
                        <Button
                            sx={getButtonStyle("/manager/sale")}
                            onClick={() => navigate("/manager/sale")}
                        >
                            Bàn và đơn hàng
                        </Button>
                        <Button
                            sx={getButtonStyle("/manager/invoice")}
                            onClick={() => navigate("/manager/invoice")}
                        >
                            Hóa đơn
                        </Button>
                        <IconButton onClick={handleNotificationMenuOpen} sx={{ color: "white" }}>
                            <Badge
                                badgeContent={notifications.filter(notif => !notif.seen).length}
                                color="error"
                            >
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                        <IconButton onClick={handleProfileMenuOpen} sx={{ color: "white" }}>
                            <AccountCircle />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            {renderProfileMenu}
            {renderNotificationMenu}
            <ToastContainer autoClose={3000} />
            {/* Các nội dung khác của EmployeeDashBoard */}
            <Box sx={{ marginTop: "64px", padding: "16px" }}>
                {/* Nội dung trang dashboard */}
            </Box>
        </>
    );
};

export default EmployeeDashBoard;
