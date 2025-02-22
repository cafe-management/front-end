import React, {useEffect, useState} from "react";
import { defineAbilitiesFor } from "../../ability";
import {Box, Button, Container, Modal, Paper, TextField, Typography} from "@mui/material";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {forgotPassword, getUserInfo, login} from "../../service/UserService";
import {toast, ToastContainer} from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAbility } from "../../Can.js"; // Đảm bảo bạn import useAbility từ Can.js

const schema = yup.object().shape({
    username: yup.string().required("Username không được để trống"),
    password: yup.string().required("Mật khẩu không được để trống")
});

function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });
    const navigate = useNavigate();
    const { setCurrentAbility } = useAbility();
    const [openModal, setOpenModal] = useState(false);
    const [emailOrUsername, setEmailOrUsername] = useState("");
    useEffect(() => {
        setCurrentAbility(defineAbilitiesFor(null));
        const userRole = localStorage.getItem("role");
        if (userRole) {
            setCurrentAbility(defineAbilitiesFor(userRole));
        }
    }, [setCurrentAbility]);

    const onSubmit = async (data) => {
        try {
            const result = await login(data.username, data.password);
            console.log("D liệu: ", result);
            if (result.success) {
                toast.success("Đăng nhập thành công");
                const { token, role, username} = result;
                localStorage.setItem("token", token);      // Lưu JWT token
                localStorage.setItem("role", role);         // Lưu role của người dùng
                localStorage.setItem("username", username);
                setCurrentAbility(defineAbilitiesFor(role));
                console.log("role:", role);
                if (role === "admin") {
                    navigate("/admin/list");
                } else if (role === "employ") {
                    const userInfo = await getUserInfo();
                    if (userInfo && userInfo.id) {
                        localStorage.setItem("userId", userInfo.id);
                    }
                    navigate("/manager/sale");
                    console.log("role:",localStorage.getItem('userId'));
                } else {
                    toast.error("Role không hợp lệ");
                }
            } else {
                toast.error("Sai tên đăng nhập hoặc mật khẩu");
            }
        } catch (error) {
            console.error("Lỗi đăng nhập:", error);

            if (error.response) {
                // Nếu có lỗi phản hồi từ server
                toast.error(`Lỗi từ server: ${error.response.data.message || "Có lỗi xảy ra"}`);
            } else {
                // Nếu không có phản hồi từ server
                toast.error("Lỗi kết nối tới server");
            }
        }
    };
    const handleForgotPassword = async () => {
        if (!emailOrUsername) {
        toast.error("Vui lòng nhập email hoặc tên tài khoản");
        return;
    }
    try {
        const response = await forgotPassword(emailOrUsername);
        if (response.success) {
            toast.success("Yêu cầu đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra email!");
            localStorage.setItem("emailOrUsername", emailOrUsername);
            navigate("/verify")
            setOpenModal(false);
        } else {
            toast.error(response.message || "Gửi yêu cầu thất bại.");
        }
    } catch (error) {
        toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
    }
};
    return (
        <>
            <Helmet>
                <title>Login</title>
            </Helmet>
            <Box sx={{ minHeight: "100vh", backgroundColor: "white", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Container maxWidth="sm">
                    <Paper elevation={3} sx={{ padding: 4, borderRadius: 3, backgroundColor: "#fff" }}>
                        <Typography variant="h5" align="center" gutterBottom sx={{ color: "#000", fontWeight: "bold" }}>
                            Đăng nhập
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <TextField
                                label="Tên tài khoản"
                                variant="outlined"
                                fullWidth
                                {...register("username")}
                                error={!!errors.username}
                                helperText={errors.username?.message}
                            />
                            <TextField
                                label="Mật khẩu"
                                type="password"
                                variant="outlined"
                                fullWidth
                                {...register("password")}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                            />
                            <Typography sx={{ cursor: "pointer", color: "blue", textAlign: "right" }} onClick={() => setOpenModal(true)}>
                                Quên mật khẩu?
                            </Typography>
                            <Button type="submit" variant="contained" fullWidth sx={{ backgroundColor: "#E7B45A", color: "#000", "&:hover": { backgroundColor: "#d09e4f" } }}>
                                Đăng nhập
                            </Button>
                        </Box>
                    </Paper>
                </Container>
            </Box>
            <Modal open={openModal} onClose={() => setOpenModal(false)}>
                <Box sx={{ width: 400, padding: 4, backgroundColor: "white", margin: "auto", marginTop: "10%", borderRadius: 2 }}>
                    <Typography variant="h6" gutterBottom>Quên mật khẩu</Typography>
                    <TextField label="Email hoặc tên tài khoản" fullWidth value={emailOrUsername} onChange={(e) => setEmailOrUsername(e.target.value)} sx={{ marginBottom: 2 }} />
                    <Button variant="contained" fullWidth onClick={handleForgotPassword}>Gửi yêu cầu</Button>
                </Box>
            </Modal>
            <ToastContainer/>
        </>
    );
}

export default Login;
