import React, { useState } from "react";
import { Box, Button, Container, Paper, TextField, Typography } from "@mui/material";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../../service/UserService";
import HeaderAdmin from "../admin/HeaderAdmin";
import EmployeeDashboard from "../../components/EmployeeDashboard"; // Import thêm cho nhân viên

const themeColor = "#E7B45A";

export default function ChangePassword() {
    const navigate = useNavigate();
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    // Lấy role từ localStorage (có thể thay đổi theo cách lưu của bạn)
    const role = localStorage.getItem("role") || "";

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            setError("Mật khẩu mới và xác nhận mật khẩu không khớp.");
            return;
        }
        try {
            const response = await changePassword(currentPassword, newPassword);
            if (response.status === 200) {
                setSuccess(true);
                setError("");
                setTimeout(() => {
                    navigate("/information");
                }, 2000);
            } else {
                setError(response.data || "Đổi mật khẩu thất bại.");
            }
        } catch (error) {
            setError("Lỗi khi thay đổi mật khẩu. Vui lòng thử lại.");
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <>
            <Helmet>
                <title>Thay đổi mật khẩu</title>
            </Helmet>
            {/* Phân quyền Header: nếu role là "admin" thì dùng HeaderAdmin, ngược lại sử dụng EmployeeDashboard */}
            {role === "admin" ? <HeaderAdmin /> : <EmployeeDashboard />}
            <Box
                sx={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "80%",
                    maxWidth: "1200px",
                    minHeight: "60vh",
                    padding: 3,
                    overflowY: "auto",
                }}
            >
                <Container maxWidth="sm">
                    <Paper elevation={3} sx={{ padding: 4, borderRadius: 3, backgroundColor: "#fff" }}>
                        <Helmet>
                            <title>Đổi mật khẩu</title>
                        </Helmet>
                        <Typography
                            variant="h5"
                            align="center"
                            gutterBottom
                            sx={{ color: themeColor, fontWeight: "bold", marginBottom: 4 }}
                        >
                            Đổi mật khẩu
                        </Typography>

                        {error && (
                            <Typography variant="body2" color="error" align="center" sx={{ marginBottom: 2 }}>
                                {error}
                            </Typography>
                        )}
                        {success && (
                            <Typography variant="body2" color="success" align="center" sx={{ marginBottom: 2 }}>
                                Đổi mật khẩu thành công!
                            </Typography>
                        )}

                        <Box component="form" sx={{ flexGrow: 1 }}>
                            <TextField
                                label="Mật khẩu hiện tại"
                                type="password"
                                fullWidth
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                sx={{ marginBottom: 2 }}
                            />
                            <TextField
                                label="Mật khẩu mới"
                                type="password"
                                fullWidth
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                sx={{ marginBottom: 2 }}
                            />
                            <TextField
                                label="Xác nhận mật khẩu mới"
                                type="password"
                                fullWidth
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                sx={{ marginBottom: 2 }}
                            />

                            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
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
                        </Box>
                    </Paper>
                </Container>
            </Box>
        </>
    );
}
