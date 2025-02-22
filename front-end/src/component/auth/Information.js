import React, { useEffect, useState } from "react";
import { Box, Button, Container, Paper, TextField, Typography, Grid, CircularProgress, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { Helmet } from "react-helmet-async";
import {useLocation, useNavigate} from "react-router-dom";
import { getUserInfo, updateEmployee } from "../../service/UserService";
import { toast } from "react-toastify";

const themeColor = "#E7B45A";

export default function AccountInfo() {
    const location = useLocation();
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(location.state?.employee || null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(!userInfo);
    const role = localStorage.getItem("role") || "";
    const [editedInfo, setEditedInfo] = useState({
        phoneNumber: "",
        address: "",
        gender: "",
    });
    const isAdmin = role === "admin";
    console.log("Role là: ", isAdmin);
    useEffect(() => {
        if (!userInfo) {
            const fetchUserInfo = async () => {
                setLoading(true);
                try {
                    const user = await getUserInfo();
                    if (user) {
                        setUserInfo(user);
                        setEditedInfo({
                            phoneNumber: user.phoneNumber || "",
                            address: user.address || "",
                            gender: user.gender || "",
                        });
                    }
                } catch (error) {
                    console.error("Lỗi khi lấy thông tin người dùng:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchUserInfo();
        }
    }, [userInfo]);
    const handleEditOrUpdate = async () => {
        if (isEditing) {
            try {
                let updatedData = {
                    ...userInfo,
                    phoneNumber: editedInfo.phoneNumber,
                    address: editedInfo.address,
                    gender: editedInfo.gender !== "" ? editedInfo.gender : userInfo.gender,
                };
                if (isAdmin) {
                    updatedData = {
                        ...updatedData,
                        fullName: editedInfo.fullName,
                        email: editedInfo.email,
                        salary: editedInfo.salary,
                    };
                }
                const response = await updateEmployee(userInfo.id, updatedData);
                if (response && response.id) {
                    setUserInfo(updatedData);
                    toast.success("Cập nhật thành công");
                } else {
                    console.error("Cập nhật thất bại:", response.message);
                }
            } catch (error) {
                console.error("Lỗi khi cập nhật thông tin:", error);
            }
        } else {
            // Khi bắt đầu chỉnh sửa, cập nhật editedInfo với dữ liệu hiện tại
            setEditedInfo({
                fullName: userInfo.fullName || "",
                address: userInfo.address || "",
                phoneNumber: userInfo.phoneNumber || "",
                gender: userInfo.gender || "",
                email: userInfo.email || "",
                salary: userInfo.salary || "",
            });
        }
        setIsEditing(!isEditing);
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

                    {loading ? (
                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "200px" }}>
                            <CircularProgress sx={{ color: themeColor }} />
                        </Box>
                    ) : userInfo ? (
                        <Box component="form" sx={{ flexGrow: 1 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Họ và tên"
                                        fullWidth
                                        value={isEditing ? editedInfo.fullName : userInfo.fullName || ""}
                                        onChange={(e) => setEditedInfo({ ...editedInfo, fullName: e.target.value })}
                                        InputLabelProps={{ shrink: true }} // 🔥 Đảm bảo label hiển thị đúng
                                        InputProps={{
                                            readOnly: !isEditing || (isEditing && !isAdmin),
                                            style: { backgroundColor: isEditing && !isAdmin ? "#f0f0f0" : "white" }
                                        }}
                                        sx={{ marginBottom: 2 }}
                                    />
                                    <TextField
                                        label="Địa chỉ"
                                        fullWidth
                                        value={isEditing ? editedInfo.address : userInfo.address || ""}
                                        onChange={(e) => setEditedInfo({ ...editedInfo, address: e.target.value })}
                                        InputLabelProps={{ shrink: true }}
                                        InputProps={{ readOnly: !isEditing, style: { backgroundColor: "white" } }}
                                        sx={{ marginBottom: 2 }}
                                    />
                                    <TextField
                                        label="Số điện thoại"
                                        fullWidth
                                        value={isEditing ? editedInfo.phoneNumber : userInfo.phoneNumber || ""}
                                        onChange={(e) => setEditedInfo({ ...editedInfo, phoneNumber: e.target.value })}
                                        InputLabelProps={{ shrink: true }}
                                        InputProps={{ readOnly: !isEditing, style: { backgroundColor: "white" } }}
                                        sx={{ marginBottom: 2 }}
                                    />
                                    {isEditing ? (
                                        <FormControl fullWidth sx={{ marginBottom: 2 }}>
                                            <InputLabel>Giới tính</InputLabel>
                                            <Select
                                                value={editedInfo.gender !== "" ? editedInfo.gender : userInfo.gender}
                                                onChange={(e) => setEditedInfo({ ...editedInfo, gender: e.target.value })}
                                            >
                                                <MenuItem value={true}>Nam</MenuItem>
                                                <MenuItem value={false}>Nữ</MenuItem>
                                            </Select>
                                        </FormControl>
                                    ) : (
                                        <TextField
                                            label="Giới tính"
                                            fullWidth
                                            value={userInfo.gender ? "Nam" : "Nữ"}
                                            InputProps={{ readOnly: true, style: { backgroundColor: isEditing ? "#f0f0f0" : "white" } }}
                                            sx={{ marginBottom: 2 }}
                                        />
                                    )}
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Tên tài khoản"
                                        fullWidth
                                        value={userInfo.account?.userName || ""}
                                        InputProps={{ readOnly: true, style: { backgroundColor: isEditing ? "#f0f0f0" : "white" } }}
                                        sx={{ marginBottom: 2 }}
                                    />
                                    <TextField
                                        label="Email"
                                        fullWidth
                                        value={isEditing ? editedInfo.email : userInfo.email || ""}
                                        onChange={(e) => setEditedInfo({ ...editedInfo, email: e.target.value })}
                                        InputLabelProps={{ shrink: true }}
                                        InputProps={{
                                            readOnly: !isEditing || (isEditing && !isAdmin), // ❗ Chỉ admin mới sửa được
                                            style: { backgroundColor: isEditing && !isAdmin ? "#f0f0f0" : "white" }
                                        }}
                                        sx={{ marginBottom: 2 }}
                                    />
                                    <TextField
                                        label="Vị trí"
                                        fullWidth
                                        value={userInfo.account?.role?.nameRoles || "Chưa có thông tin"}
                                        InputProps={{ readOnly: true, style: { backgroundColor: isEditing ? "#f0f0f0" : "white" } }}
                                        sx={{ marginBottom: 2 }}
                                    />
                                    <TextField
                                        label="Lương"
                                        fullWidth
                                        value={isEditing ? editedInfo.salary : formatCurrency(userInfo.salary) || ""}
                                        onChange={(e) => setEditedInfo({ ...editedInfo, salary: e.target.value })}
                                        InputLabelProps={{ shrink: true }}
                                        InputProps={{
                                            readOnly: !isEditing || (isEditing && !isAdmin), // ❗ Chỉ admin mới sửa được
                                            style: { backgroundColor: isEditing && !isAdmin ? "#f0f0f0" : "white" }
                                        }}
                                        sx={{ marginBottom: 2 }}
                                    />
                                </Grid>
                            </Grid>

                            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
                                <Button variant="contained" onClick={handleEditOrUpdate} sx={{ backgroundColor: themeColor, color: "#fff", "&:hover": { backgroundColor: "#C8964A" } }}>
                                    {isEditing ? "Cập nhật" : "Chỉnh sửa"}
                                </Button>
                                {!isAdmin && (
                                    <Button
                                        variant="contained"
                                        onClick={handleChangePassword}
                                        sx={{ backgroundColor: themeColor, color: "#fff", "&:hover": { backgroundColor: "#C8964A" } }}
                                    >
                                        Đổi mật khẩu
                                    </Button>
                                )}
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
