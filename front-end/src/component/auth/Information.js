import React, { useEffect, useState } from "react";
import { Box, Button, Container, Paper, TextField, Typography, MenuItem, Grid } from "@mui/material";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { getUserById } from "../../service/UserService"; // Giả sử bạn có hàm lấy thông tin người dùng
import { toast } from "react-toastify";

export default function AccountInfo() {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null); // Khởi tạo userInfo là null
    const [isEditing, setIsEditing] = useState(false); // Trạng thái cho phép chỉnh sửa

    // Gọi API lấy thông tin người dùng khi component mount
    useEffect(() => {
        const fetchUserInfo = async () => {
            const userId = localStorage.getItem("userId"); // Lấy userId từ localStorage hoặc từ context
            if (!userId) {
                toast.error("Không có ID người dùng");
                navigate("/login"); // Điều hướng về trang login nếu không có userId
                return; // Dừng lại nếu không có userId
            }
            try {
                const data = await getUserById(userId); // Lấy thông tin người dùng từ API
                if (data) {
                    setUserInfo(data); // Cập nhật thông tin người dùng
                } else {
                    toast.error("Không thể tìm thấy thông tin người dùng.");
                }
            } catch (error) {
                console.error("Lỗi khi lấy thông tin người dùng:", error);
                toast.error("Lỗi khi lấy thông tin người dùng!");
            }
        };

        fetchUserInfo(); // Gọi hàm lấy thông tin người dùng
    }, [navigate]);

    // Hàm xử lý chỉnh sửa thông tin
    const handleEdit = () => {
        setIsEditing(true);
    };

    // Hàm xử lý cập nhật thông tin
    const handleUpdate = () => {
        // Xử lý cập nhật thông tin người dùng
        setIsEditing(false);
    };

    return (
        <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "white" }}>
            <Container maxWidth="md">
                <Paper elevation={3} sx={{ padding: 4, borderRadius: 3, backgroundColor: "#fff" }}>
                    <Helmet>
                        <title>Thông tin tài khoản</title>
                    </Helmet>
                    <Typography variant="h5" align="center" gutterBottom sx={{ color: "#000", fontWeight: "bold" }}>
                        Thông tin tài khoản
                    </Typography>
                    {userInfo ? (
                        <Box component="form" sx={{ flexGrow: 1 }}>
                            {/* Hiển thị thông tin người dùng */}
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Tên tài khoản"
                                        fullWidth
                                        value={userInfo.username || ""}
                                        InputProps={{ readOnly: true }}
                                    />
                                    {/* Các trường khác */}
                                </Grid>
                            </Grid>

                            {/* Nút bấm */}
                            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
                                <Button variant="contained" onClick={handleEdit}>
                                    Chỉnh sửa
                                </Button>
                                <Button variant="outlined" onClick={handleUpdate}>
                                    Cập nhật
                                </Button>
                            </Box>
                        </Box>
                    ) : (
                        <Typography variant="h6" align="center" sx={{ color: "red" }}>
                            Không có thông tin người dùng.
                        </Typography>
                    )}
                </Paper>
            </Container>
        </Box>
    );
}
