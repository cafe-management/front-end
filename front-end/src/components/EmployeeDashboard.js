import React, { useEffect, useMemo, useState } from "react";
import {Link, useNavigate} from "react-router-dom";
import { styled } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { Howl } from "howler";
import { getAllNotifications, markAllNotificationsAsSeen } from "../service/NotificationService";
import { API_URL_SOCKET } from "../config/apiConfig";

// Import react-toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Styled component cho các liên kết trên desktop
const DesktopLinks = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    marginLeft: theme.spacing(2),
    "& a": {
        color: "inherit",
        textDecoration: "none",
        marginRight: theme.spacing(2),
        fontSize: "1rem",
        fontWeight: 500,
    },
}));

const EmployeeDashBoard = () => {
    // Các state cho menu
    const [anchorEl, setAnchorEl] = useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
    const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
    const [notifications, setNotifications] = useState([]);

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
    const isNotificationMenuOpen = Boolean(notificationAnchorEl);
    const navigate = useNavigate();
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
                    console.log("Thông báo nhận được:", notification);
                    // Giả sử thông báo mới nhận chưa được đọc (seen: false)
                    setNotifications((prev) => [{ ...notification, seen: false }, ...prev]);
                    notificationSound.play();
                    toast.info("Có thông báo mới!", {
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

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        console.log("Role sau khi xóa:", localStorage.getItem("role"));
        navigate("/login");
    };
    const handleAccountInfoClick = () => {
        handleMenuClose();
        navigate("/information");
    };
    // Khi tắt menu thông báo, gọi API đánh dấu đã xem và cập nhật trạng thái trong state
    const handleNotificationMenuClose = async () => {
        setNotificationAnchorEl(null);
        try {
            await markAllNotificationsAsSeen();
            // Cập nhật trạng thái "seen" cho tất cả các thông báo
            setNotifications((prev) =>
                prev.map((notif) => ({ ...notif, seen: true }))
            );
        } catch (error) {
            console.error("Error marking notifications as seen:", error);
        }
    };

    const handleNotificationMenuOpen = (event) => {
        setNotificationAnchorEl(event.currentTarget);
    };

    const menuId = "primary-search-account-menu";
    const renderProfileMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            id={menuId}
            keepMounted
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleAccountInfoClick}>Thông Tin Cá Nhân</MenuItem>
            <MenuItem onClick={handleLogout}>Đăng xuất </MenuItem>
        </Menu>
    );

    const mobileMenuId = "primary-search-account-menu-mobile";
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <MenuItem onClick={handleNotificationMenuOpen}>
                <IconButton size="large" color="inherit">
                    {/* Chỉ tính các thông báo chưa đọc */}
                    <Badge badgeContent={notifications.filter((n) => !n.seen).length} color="error">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
                <p>Notifications</p>
            </MenuItem>
            <MenuItem onClick={handleAccountInfoClick}>
                <IconButton
                    size="large"
                    aria-controls={menuId}
                    aria-haspopup="true"
                    color="inherit"
                >
                    <AccountCircle />
                </IconButton>
                <p>Profile</p>
            </MenuItem>
            <MenuItem
                component={Link}
                to="/manager/feedback"
                onClick={handleMobileMenuClose}
            >
                Feedback
            </MenuItem>
            <MenuItem
                component={Link}
                to="/manager/sale"
                onClick={handleMobileMenuClose}
            >
                Sale
            </MenuItem>
        </Menu>
    );

    const renderNotificationMenu = (
        <Menu
            anchorEl={notificationAnchorEl}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            id="notification-menu"
            keepMounted
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            open={isNotificationMenuOpen}
            onClose={handleNotificationMenuClose}
        >
            {notifications.length === 0 ? (
                <MenuItem onClick={handleNotificationMenuClose}>
                    No notifications
                </MenuItem>
            ) : (
                notifications.map((notif, index) => (
                    <MenuItem
                        key={index}
                        onClick={handleNotificationMenuClose}
                        // Nếu đã đọc thì hiển thị màu xám, ngược lại màu mặc định
                        style={{ color: notif.seen ? "gray" : "inherit" }}
                    >
                        {notif.content} -{" "}
                        {new Date(notif.dateNote).toLocaleString("vi-VN")}
                    </MenuItem>
                ))
            )}
        </Menu>
    );

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" sx={{ backgroundColor: "#808080" }}>
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ display: { xs: "none", sm: "block" } }}
                    >
                        MyApp
                    </Typography>
                    <DesktopLinks sx={{ display: { xs: "none", sm: "flex" } }}>
                        <Link to="/manager/feedback">Feedback</Link>
                        <Link to="/manager/sale">Sale</Link>
                    </DesktopLinks>
                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ display: { xs: "none", md: "flex" } }}>
                        <IconButton
                            size="large"
                            aria-label="show new notifications"
                            color="inherit"
                            onClick={handleNotificationMenuOpen}
                        >
                            <Badge badgeContent={notifications.filter((n) => !n.seen).length} color="error">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                        <IconButton
                            size="large"
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                            color="inherit"
                            sx={{ ml: 1 }}
                        >
                            <AccountCircle />
                        </IconButton>
                    </Box>
                    <Box sx={{ display: { xs: "flex", md: "none" } }}>
                        <IconButton
                            size="large"
                            aria-label="show more"
                            aria-controls={mobileMenuId}
                            aria-haspopup="true"
                            onClick={handleMobileMenuOpen}
                            color="inherit"
                        >
                            <MoreIcon />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            {renderMobileMenu}
            {renderProfileMenu}
            {renderNotificationMenu}
            <ToastContainer />
        </Box>
    );
};

export default EmployeeDashBoard;
