import React, { useEffect } from "react";
import { defineAbilitiesFor } from "../../ability";
import { Box, Button, Container, Paper, TextField, Typography } from "@mui/material";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { login } from "../../service/UserService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAbility } from "../../Can.js"; // Đảm bảo bạn import useAbility từ Can.js

const schema = yup.object().shape({
    username: yup.string().required("Username không được để trống"),
    password: yup.string().required("Mật khẩu không được để trống")
});

function Login() {
    const { register, handleSubmit, formState: { errors }, setError } = useForm({
        resolver: yupResolver(schema)
    });
    const navigate = useNavigate();
    const { setCurrentAbility } = useAbility();

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
            if (result.success) {
                toast.success("Đăng nhập thành công");
                const { token, role, username } = result;
                localStorage.setItem("token", token);      // Lưu JWT token
                localStorage.setItem("role", role);         // Lưu role của người dùng
                localStorage.setItem("username", username);
                setCurrentAbility(defineAbilitiesFor(role));
                localStorage.setItem("role", role);
                console.log("role:", role);
                if (role === "admin") {
                    navigate("/admin/list");
                } else if (role === "employ") {
                    navigate("/information");
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
                            <Button type="submit" variant="contained" fullWidth sx={{ backgroundColor: "#E7B45A", color: "#000", "&:hover": { backgroundColor: "#d09e4f" } }}>
                                Đăng nhập
                            </Button>
                        </Box>
                    </Paper>
                </Container>
            </Box>
        </>
    );
}

export default Login;
