import React, { useState } from "react";
import { Box, Button, Container, Paper, TextField, Typography } from "@mui/material";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form"; // Import react-hook-form
import * as yup from "yup"; // Import yup
import { yupResolver } from "@hookform/resolvers/yup"; // Import yup resolver
import { login } from "../../service/UserService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const schema = yup.object().shape({
    username: yup.string().required("Username không được để trống"),
    password: yup.string().required("Mật khẩu không được để trống")
});

function Login() {
    const { register, handleSubmit, formState: { errors }, setError } = useForm({
        resolver: yupResolver(schema)
    });

    const navigate = useNavigate(); // Initialize navigate for page redirection

    const onSubmit = async (data) => {
        console.log("Username:", data.username, "Password:", data.password);
        try {
            const result = await login(data.username, data.password);
            if (result.success) {
                toast.success("Đăng nhập thành công");

                // Điều hướng đến trang thông tin người dùng sau khi đăng nhập thành công
                navigate("/information"); // Điều hướng tới trang thông tin người dùng
            } else {
                setError("password", { type: "manual", message: "*** Sai username hoặc mật khẩu" });
            }
        } catch (error) {
            toast.error("Lỗi kết nối tới server");
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
