import React, { useState } from "react";
import {
    AppBar,
    Toolbar,
    Button,
    Box,
    Menu,
    MenuItem,
    IconButton,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAbility } from "../../Can";
import { defineAbilitiesFor } from "../../ability";
import { AccountCircle } from "@mui/icons-material";

function EmployeeManagementHeader() {
    const navigate = useNavigate();
    const location = useLocation();
    const [anchorEl, setAnchorEl] = useState(null);
    const isProfileMenuOpen = Boolean(anchorEl);
    const { setCurrentAbility } = useAbility();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        console.log("Role sau khi xóa:", localStorage.getItem("role"));
        setCurrentAbility(defineAbilitiesFor(null));
        localStorage.clear();
        navigate("/login");
    };

    const handleGoToEmployeeList = () => {
        navigate("/admin/list");
    };

    const handleGoToListNew = () => {
        navigate("/news");
    };

    const handleGotoChart = () => {
        navigate("/chart");
    };

    const handleGotoDrink = () => {
        navigate("/admin/menu");
    };

    // Thêm hàm điều hướng đến trang quản lý danh mục
    const handleGotoCategory = () => {
        navigate("/category");
    };

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

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
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                },
            }}
        >
            <MenuItem
                onClick={() => {
                    handleMenuClose();
                    navigate("/change_password");
                }}
                sx={{ py: 1 }}
            >
                Đổi Mật Khẩu
            </MenuItem>
            <MenuItem onClick={handleLogout} sx={{ py: 1 }}>
                Đăng Xuất
            </MenuItem>
        </Menu>
    );

    const isEmployeeListActive = location.pathname === "/admin/list";
    const isNewsListActive = location.pathname === "/news";
    const isChartActive = location.pathname === "/chart";
    const isDrinkActive = location.pathname === "/admin/menu";
    const isCategoryActive = location.pathname === "/category";

    return (
        <>
            <AppBar
                position="fixed"
                sx={{
                    backgroundColor: "#333",
                    width: "100%",
                    boxShadow: "none",
                }}
            >
                <Toolbar
                    sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        width: "100%",
                        maxWidth: "1200px",
                        margin: "0 auto",
                    }}
                >
                    <Box sx={{ display: "flex", gap: 2 }}>
                        <Button
                            color={isEmployeeListActive ? "primary" : "inherit"}
                            sx={{
                                fontWeight: "bold",
                                padding: "8px 16px",
                                color: isEmployeeListActive ? "#fff" : "white",
                                textTransform: "uppercase",
                                backgroundColor: isEmployeeListActive ? "#E7B45A" : "transparent",
                                boxShadow: isEmployeeListActive
                                    ? "0px 4px 10px rgba(231, 180, 90, 0.6)"
                                    : "none",
                                "&:hover": {
                                    backgroundColor: "#E7B45A",
                                    color: "#fff",
                                    boxShadow: "0px 6px 12px rgba(231, 180, 90, 0.8)",
                                },
                            }}
                            onClick={handleGoToEmployeeList}
                        >
                            Quản Lý Nhân Viên
                        </Button>
                        <Button
                            color={isNewsListActive ? "primary" : "inherit"}
                            sx={{
                                fontWeight: "bold",
                                padding: "8px 16px",
                                backgroundColor: isNewsListActive ? "#E7B45A" : "transparent",
                                color: isNewsListActive ? "#fff" : "white",
                                boxShadow: isNewsListActive
                                    ? "0px 4px 10px rgba(231, 180, 90, 0.6)"
                                    : "none",
                                "&:hover": {
                                    backgroundColor: "#E7B45A",
                                    color: "#fff",
                                    boxShadow: "0px 6px 12px rgba(231, 180, 90, 0.8)",
                                },
                            }}
                            onClick={handleGoToListNew}
                        >
                            Quản lý tin tức
                        </Button>
                        <Button
                            color={isChartActive ? "primary" : "inherit"}
                            sx={{
                                fontWeight: "bold",
                                padding: "8px 16px",
                                backgroundColor: isChartActive ? "#E7B45A" : "transparent",
                                color: isChartActive ? "#fff" : "white",
                                boxShadow: isChartActive
                                    ? "0px 4px 10px rgba(231, 180, 90, 0.6)"
                                    : "none",
                                "&:hover": {
                                    backgroundColor: "#E7B45A",
                                    color: "#fff",
                                    boxShadow: "0px 6px 12px rgba(231, 180, 90, 0.8)",
                                },
                            }}
                            onClick={handleGotoChart}
                        >
                            Quản lý Doanh Thu
                        </Button>
                        <Button
                            color={isDrinkActive ? "primary" : "inherit"}
                            sx={{
                                fontWeight: "bold",
                                padding: "8px 16px",
                                backgroundColor: isDrinkActive ? "#E7B45A" : "transparent",
                                color: isDrinkActive ? "#fff" : "white",
                                boxShadow: isDrinkActive
                                    ? "0px 4px 10px rgba(231, 180, 90, 0.6)"
                                    : "none",
                                "&:hover": {
                                    backgroundColor: "#E7B45A",
                                    color: "#fff",
                                    boxShadow: "0px 6px 12px rgba(231, 180, 90, 0.8)",
                                },
                            }}
                            onClick={handleGotoDrink}
                        >
                            Quản lý Đồ Uống
                        </Button>
                        {/* Nút mới: Quản lý Danh Mục */}
                        <Button
                            color={isCategoryActive ? "primary" : "inherit"}
                            sx={{
                                fontWeight: "bold",
                                padding: "8px 16px",
                                backgroundColor: isCategoryActive ? "#E7B45A" : "transparent",
                                color: isCategoryActive ? "#fff" : "white",
                                boxShadow: isCategoryActive
                                    ? "0px 4px 10px rgba(231, 180, 90, 0.6)"
                                    : "none",
                                "&:hover": {
                                    backgroundColor: "#E7B45A",
                                    color: "#fff",
                                    boxShadow: "0px 6px 12px rgba(231, 180, 90, 0.8)",
                                },
                            }}
                            onClick={handleGotoCategory}
                        >
                            Quản lý Danh Mục
                        </Button>
                        <IconButton onClick={handleProfileMenuOpen} sx={{ color: "white" }}>
                            <AccountCircle />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            {renderProfileMenu}
        </>
    );
}

export default EmployeeManagementHeader;
