import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import {useAbility} from "../../Can";
import {defineAbilitiesFor} from "../../ability";

function EmployeeManagementHeader() {
    const navigate = useNavigate();
    const location = useLocation(); // Lấy thông tin location hiện tại
    const { setCurrentAbility } = useAbility();
        const handleLogout = () => {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            console.log("Role sau khi xóa:", localStorage.getItem("role")); // Kiểm tra còn role không
            setCurrentAbility(defineAbilitiesFor(null));
            navigate("/login");
    };

    const handleGoToEmployeeList = () => {
        navigate("/admins/list"); // Điều hướng đến trang EmployeeList
    };

    const handleGoToAddEmployee = () => {
        navigate("/admins/register"); // Điều hướng đến trang Thêm Nhân Viên
    };
    const handleGoToListNew = () => {
        navigate("/news");
    };

    // Kiểm tra trang hiện tại
    const isEmployeeListActive = location.pathname === "/admins/list";
    const isAddEmployeeActive = location.pathname === "/admins/register"; 

    return (
        <AppBar  position="fixed" sx={{ backgroundColor: "#333",width: "100%", boxShadow: "none" }}>
            <Toolbar sx={{ display: "flex", justifyContent: "flex-end", width: "100%", maxWidth: "1200px", margin: "0 auto" }}>
                <Box sx={{ display: "flex", gap: 2 }}>
                    <Button
                        color={isEmployeeListActive ? "primary" : "inherit"} // Đổi màu nếu đang ở trang quản lý nhân viên
                        sx={{
                            fontWeight: "bold",
                            padding: "8px 16px",
                            color: isEmployeeListActive ? "#fff" : "white",
                            textTransform: "uppercase", // In hoa chữ
                            backgroundColor: isEmployeeListActive ? "#E7B45A" : "transparent", // Thêm màu nền khi active
                            boxShadow: isEmployeeListActive ? "0px 4px 10px rgba(231, 180, 90, 0.6)" : "none", // Thêm bóng đổ
                            "&:hover": {
                                backgroundColor: "#E7B45A",
                                color: "#fff",
                                boxShadow: "0px 6px 12px rgba(231, 180, 90, 0.8)", // Bóng đổ khi hover
                            },
                        }}
                        onClick={handleGoToEmployeeList} // Điều hướng tới EmployeeList
                    >
                        Quản Lý Nhân Viên
                    </Button>
                    <Button
                        color={isAddEmployeeActive ? "primary" : "inherit"} // Đổi màu nếu đang ở trang thêm nhân viên
                        sx={{
                            fontWeight: "bold",
                            padding: "8px 16px",
                            backgroundColor: isAddEmployeeActive ? "#E7B45A" : "transparent", // Thêm màu nền khi active
                            color: isAddEmployeeActive ? "#fff" : "white",
                            boxShadow: isAddEmployeeActive ? "0px 4px 10px rgba(231, 180, 90, 0.6)" : "none", // Thêm bóng đổ
                            "&:hover": {
                                backgroundColor: "#E7B45A",
                                color: "#fff",
                                boxShadow: "0px 6px 12px rgba(231, 180, 90, 0.8)", // Bóng đổ khi hover
                            },
                        }}
                        onClick={handleGoToAddEmployee} // Điều hướng tới trang thêm nhân viên
                    >
                        Thêm Nhân Viên
                    </Button>
                    <Button
                        color={isAddEmployeeActive ? "primary" : "inherit"} // Đổi màu nếu đang ở trang thêm nhân viên
                        sx={{
                            fontWeight: "bold",
                            padding: "8px 16px",
                            backgroundColor: isAddEmployeeActive ? "#E7B45A" : "transparent",
                            color: isAddEmployeeActive ? "#fff" : "white",
                            boxShadow: isAddEmployeeActive ? "0px 4px 10px rgba(231, 180, 90, 0.6)" : "none",
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
                        color="inherit"
                        sx={{
                            fontWeight: "bold",
                            padding: "8px 16px",
                            "&:hover": {
                                backgroundColor: "#E7B45A",
                                color: "#fff",
                            },
                        }}
                        onClick={handleLogout}
                    >
                        Đăng Xuất
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default EmployeeManagementHeader;
