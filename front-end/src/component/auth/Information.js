import React, { useEffect, useState } from "react";
import { Box, Button, Container, Paper, TextField, Typography, Grid } from "@mui/material";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import {getUserInfo, updateEmployee} from "../../service/UserService";
import {toast} from "react-toastify";

const themeColor = "#E7B45A";

export default function AccountInfo() {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedInfo, setEditedInfo] = useState({
        phoneNumber: "",
        address: "",
    });
    useEffect(() => {
        const fetchUserInfo = async () => {
            const username = localStorage.getItem("username");
            const user = await getUserInfo();
            if (user) {
                setUserInfo(user);
                setEditedInfo({
                    phoneNumber: user.phoneNumber,
                    address: user.address,
                });
            } else {
                console.log("Không tìm thấy thông tin người dùng.");
            }
        };

        fetchUserInfo();
    }, [navigate]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleUpdate = async () => {
        try {
            const updatedData = {
                ...userInfo,
                phoneNumber: editedInfo.phoneNumber,
                address: editedInfo.address,
            };
            const response = await updateEmployee(userInfo.id, updatedData);
            if (response && response.id) {
                setUserInfo({
                    ...userInfo,
                    phoneNumber: editedInfo.phoneNumber,
                    address: editedInfo.address,
                });
                setIsEditing(false);
                toast.success("Cập nhật thành công")
            } else {
                console.error("Cập nhật thất bại:", response.message);
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật thông tin:", error);
        }
    };
    const handleBack = () => {
        navigate("/manager/sale");
    };
    const handleChangePassword = () => {
        navigate("/change_password");
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
    };

    return (
        <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#F4F4F4" }}>
            <Container maxWidth="md">
                <Paper elevation={3} sx={{ padding: 4, borderRadius: 3, backgroundColor: "#fff" }}>
                    <Helmet>
                        <title>Thông tin tài khoản</title>
                    </Helmet>
                    <Typography
                        variant="h5"
                        align="center"
                        gutterBottom
                        sx={{ color: themeColor, fontWeight: "bold", marginBottom: 4 }}
                    >
                        Thông tin tài khoản
                    </Typography>
                    {userInfo ? (
                        <Box component="form" sx={{ flexGrow: 1 }}>
                            {/* Hiển thị thông tin người dùng */}
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    {/* Các thông tin bên trái */}
                                    <TextField
                                        label="Họ và tên"
                                        fullWidth
                                        value={userInfo.fullName || ""}
                                        InputProps={{ readOnly: true }}
                                        sx={{
                                            marginBottom: 2,
                                            backgroundColor: isEditing ? "#f0f0f0" : "white"
                                        }}
                                    />
                                    <TextField
                                        label="Địa chỉ"
                                        fullWidth
                                        value={isEditing ? editedInfo.address : userInfo.address || ""}
                                        onChange={(e) => setEditedInfo({ ...editedInfo, address: e.target.value })}
                                        InputProps={{ readOnly: !isEditing }}
                                        sx={{ marginBottom: 2 }}
                                    />
                                    <TextField
                                        label="Số điện thoại"
                                        fullWidth
                                        value={isEditing ? editedInfo.phoneNumber : userInfo.phoneNumber || ""}
                                        onChange={(e) => setEditedInfo({ ...editedInfo, phoneNumber: e.target.value })}
                                        InputProps={{ readOnly: !isEditing }}
                                        sx={{ marginBottom: 2 }}
                                    />
                                    <TextField
                                        label="Giới tính"
                                        fullWidth
                                        value={userInfo.gender ? "Nam" : "Nữ"}
                                        InputProps={{ readOnly: true }}
                                        sx={{
                                            marginBottom: 2,
                                            backgroundColor: isEditing ? "#f0f0f0" : "white"
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    {/* Các thông tin bên phải */}
                                    <TextField
                                        label="Tên tài khoản"
                                        fullWidth
                                        value={userInfo.account?.userName || ""}
                                        InputProps={{ readOnly: true }}
                                        sx={{
                                            marginBottom: 2,
                                            backgroundColor: isEditing ? "#f0f0f0" : "white"
                                        }}
                                    />
                                    <TextField
                                        label="Email"
                                        fullWidth
                                        value={userInfo.email || ""}
                                        InputProps={{ readOnly: true }}
                                        sx={{
                                            marginBottom: 2,
                                            backgroundColor: isEditing ? "#f0f0f0" : "white"
                                        }}
                                    />
                                    <TextField
                                        label="Vị trí"
                                        fullWidth
                                        value={userInfo.account?.role?.nameRoles || "Chưa có thông tin"}
                                        InputProps={{ readOnly: true }}
                                        sx={{
                                            marginBottom: 2,
                                            backgroundColor: isEditing ? "#f0f0f0" : "white"
                                        }}
                                    />
                                    <TextField
                                        label="Lương"
                                        fullWidth
                                        value={userInfo.salary ? formatCurrency(userInfo.salary) : ""}
                                        InputProps={{ readOnly: true }}
                                        sx={{
                                            marginBottom: 2,
                                            backgroundColor: isEditing ? "#f0f0f0" : "white"
                                        }}
                                    />
                                </Grid>
                            </Grid>

                            {/* Nút bấm */}
                            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
                                <Button
                                    variant="contained"
                                    onClick={handleEdit}
                                    sx={{ backgroundColor: themeColor, color: "#fff", "&:hover": { backgroundColor: "#C8964A" } }}
                                >
                                    Chỉnh sửa
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={handleBack}
                                    sx={{ borderColor: themeColor, color: themeColor, "&:hover": { borderColor: "#C8964A", color: "#C8964A" } }}
                                >
                                    Quay lại
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={handleChangePassword}
                                    sx={{ backgroundColor: themeColor, color: "#fff", "&:hover": { backgroundColor: "#C8964A" } }}
                                >
                                    Đổi mật khẩu
                                </Button>
                            </Box>
                            {isEditing && (
                                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                                    <Button variant="contained" onClick={handleUpdate} sx={{ backgroundColor: themeColor, color: "#fff", "&:hover": { backgroundColor: "#C8964A" } }}>
                                        Cập nhật
                                    </Button>
                                </Box>
                            )}
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
