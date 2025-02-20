import React, {useEffect, useState} from "react";
import { Box, Button, Container, Paper, TextField, Typography } from "@mui/material";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../../service/UserService"; // Hàm gọi API để thay đổi mật khẩu

const themeColor = "#E7B45A"; // Màu chủ đạo

export default function ChangePassword() {
    const navigate = useNavigate();
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    // Hàm xử lý thay đổi mật khẩu
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
        navigate(-1); // Quay lại trang trước
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#F4F4F4",
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

                    {/* Hiển thị thông báo lỗi hoặc thành công */}
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

                    {/* Form đổi mật khẩu */}
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

                        {/* Nút bấm */}
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
    );
}
