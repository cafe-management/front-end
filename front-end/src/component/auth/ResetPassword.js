import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { resetPassword, verifyOtp } from "../../service/UserService";
import {toast, ToastContainer} from "react-toastify";
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Box,
    CircularProgress,
} from "@mui/material";
import { Helmet } from "react-helmet-async";

function ResetPassword() {
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [otpError, setOtpError] = useState(false);
    const [isOtpVerified, setIsOtpVerified] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const storedEmailOrUsername = localStorage.getItem("emailOrUsername");
    const emailOrUsername = location.state?.emailOrUsername || storedEmailOrUsername || "";

    // Xác thực OTP
    const handleVerifyOtp = async () => {
        if (!otp.trim()) {
            setOtpError(true);
            toast.error("❌ Vui lòng nhập mã OTP!");
            return;
        }
        setLoading(true);
        const response = await verifyOtp(emailOrUsername, otp);
        setLoading(false);
        if (response.success) {
            toast.success("✅ OTP hợp lệ! Hãy đặt mật khẩu mới.");
            setOtpError(false);
            setIsOtpVerified(true); // Hiển thị ô nhập mật khẩu
        } else {
            toast.error("❌ " + response.message);
            setOtpError(true);
            setIsOtpVerified(false);
        }
    };

    const handleResetPassword = async () => {
        setLoading(true);
        const response = await resetPassword(emailOrUsername, otp, password);
        setLoading(false);
        if (response.success) {
            toast.success("✅ Mật khẩu đã được cập nhật thành công! Hãy đăng nhập lại.");
            navigate("/login");
        } else {
            toast.error(response.message);
        }
    };

    return (
        <>
            <Helmet>
                <title>Reset Password</title>
            </Helmet>
            <Container component="main" maxWidth="xs">
                <Paper elevation={3} sx={{ padding: 4, marginTop: 8, textAlign: "center", backgroundColor: "#fff" }}>
                    <Typography variant="h5" gutterBottom sx={{ color: "#E7B45A", fontWeight: "bold" }}>
                        {isOtpVerified ? "Nhập mật khẩu mới" : "Xác thực OTP"}
                    </Typography>

                    {!isOtpVerified && (
                        <>
                            <TextField
                                label="Nhập mã OTP"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                error={otpError}
                                helperText={otpError ? "OTP không hợp lệ!" : ""}
                            />

                            <Box mt={2}>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    onClick={handleVerifyOtp}
                                    disabled={loading}
                                    sx={{
                                        backgroundColor: "#E7B45A",
                                        color: "#000",
                                        "&:hover": { backgroundColor: "#d09e4f" },
                                    }}
                                >
                                    {loading ? <CircularProgress size={24} color="inherit" /> : "Xác thực OTP"}
                                </Button>
                            </Box>
                        </>
                    )}

                    {isOtpVerified && (
                        <>
                            <TextField
                                label="Nhập mật khẩu mới"
                                type="password"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            <Box mt={2}>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    onClick={handleResetPassword}
                                    disabled={loading}
                                    sx={{
                                        backgroundColor: "#E7B45A",
                                        color: "#000",
                                        "&:hover": { backgroundColor: "#d09e4f" },
                                    }}
                                >
                                    {loading ? <CircularProgress size={24} color="inherit" /> : "Đổi mật khẩu"}
                                </Button>
                            </Box>
                        </>
                    )}
                </Paper>
            </Container>
        </>
    );
}

export default ResetPassword;
