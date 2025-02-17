import React from "react";
import { Box, Button, Container, Paper, TextField, Typography } from "@mui/material";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form"; // Import react-hook-form
import * as yup from "yup"; // Import yup
import { yupResolver } from "@hookform/resolvers/yup"; // Import yup resolver
import { login } from "../../service/UserService";
import { toast } from "react-toastify";

const schema = yup.object().shape({
    email: yup.string().required("Email không được để trống").email("Email không hợp lệ"),
    password: yup.string().required("Mật khẩu không được để trống")
});

function Login() {
    const { register, handleSubmit, formState: { errors }, setError } = useForm({
        resolver: yupResolver(schema)
    });

    const onSubmit = async (data) => {
        console.log("Email:", data.email, "Password:", data.password);
        try {
            const result = await login(data.email, data.password);
            if (result.success) {
                toast.success("Đăng nhập thành công");
            } else {
                // Nếu có lỗi từ server, hiển thị lỗi trong form
                setError("password", { type: "manual", message: "*** Sai email hoặc mật khẩu" });
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
                                label="Email"
                                variant="outlined"
                                fullWidth
                                {...register("email")}
                                error={!!errors.email}
                                helperText={errors.email?.message}
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
