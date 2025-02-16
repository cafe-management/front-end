import React, { useState } from "react";
import { Box, Button, Container, Paper, TextField, Typography } from "@mui/material";
import { Helmet } from "react-helmet-async";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Email:", email, "Password:", password);
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
                        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <TextField
                                label="Email"
                                variant="outlined"
                                fullWidth
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                sx={{ "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "#E7B45A" } } }}
                            />
                            <TextField
                                label="Mật khẩu"
                                type="password"
                                variant="outlined"
                                fullWidth
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                sx={{ "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "#E7B45A" } } }}
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
