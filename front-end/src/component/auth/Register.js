import React, { useEffect, useState } from "react";
import { Box, Button, Container, Paper, TextField, Typography, MenuItem, Grid } from "@mui/material";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAbility } from "../../Can";  // Import CASL
import { checkAccount, createEmployee } from "../../service/UserService";
import { toast } from "react-toastify";
import HeaderAdmin from "../admin/HeaderAdmin";
export default function Register() {
    const navigate = useNavigate();
    const { ability } = useAbility();
    useEffect(() => {
        const role = localStorage.getItem("role");

        if (role !== "admin") {
            navigate("/login");
        }
    }, []);
    const schema = yup.object().shape({
        username: yup.string().required("Không được để trống").min(6, "Tên tài khoản ít nhất 6 ký tự"),
        fullName: yup.string().required("Không được để trống"),
        address: yup.string().required("Không được để trống"),
        email: yup.string().required("Không được để trống").email("Email không hợp lệ"),
        phone: yup.string().required("Không được để trống").matches(/^\d{10,11}$/, "Số điện thoại phải có 10-11 chữ số"),
        salary: yup.number().typeError("Lương phải là số").required("Không được để trống").moreThan(0, "Lương phải lớn hơn 0"),
    });
    const { register, handleSubmit, setError, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: { birthDate: "", gender: "" }
    });
    const onSubmit = async (data, event) => {
        event.preventDefault();
        const exists = await checkAccount(data.email, data.username);
        if (!exists) {
            toast.error("Lỗi kiểm tra tài khoản, thử lại sau");
            return;
        }
        if (exists.existsUsername) {
            setError("username", { type: "manual", message: "Tên người dùng đã tồn tại" });
            return;
        }
        if (exists.existsEmail) {
            setError("email", { type: "manual", message: "Email đã tồn tại" });
            return;
        }
        const modifiedData = {
            ...data,
            birthDate: data.birthDate || "",
            gender: data.gender === "Nam",
            phoneNumber: data.phone,
            phone: undefined,
            account: {
                userName: data.username,
                email: data.email,
                role: { id: 1, nameRoles: "employ" },
            },
        };
        try {
            const response = await createEmployee(modifiedData);
            if (response && response.id) {
                toast.success("Thêm nhân viên thành công!");
                setTimeout(() => navigate("/admins/list"), 1500);
            } else {
                toast.error("Thêm nhân viên thất bại!");
            }
        } catch (error) {
            toast.error("Lỗi khi thêm nhân viên!");
        }
    };
    return (
        <>
            <Helmet><title>Thêm mới nhân viên</title></Helmet>
            <HeaderAdmin />
            <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "white" }}>
                <Container maxWidth="md">
                    <Paper elevation={3} sx={{ padding: 4, borderRadius: 3, backgroundColor: "#fff" }}>
                        <Typography variant="h5" align="center" gutterBottom sx={{ color: "#000", fontWeight: "bold" }}>
                            Đăng ký tài khoản
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ flexGrow: 1 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField sx={{ mb: 2 }} label="Tên tài khoản *" fullWidth {...register("username")} error={!!errors.username} helperText={errors.username?.message} />
                                    <TextField sx={{ mb: 2 }} label="Tên đầy đủ *" fullWidth {...register("fullName")} error={!!errors.fullName} helperText={errors.fullName?.message} />
                                    <TextField sx={{ mb: 2 }} label="Địa chỉ *" fullWidth {...register("address")} error={!!errors.address} helperText={errors.address?.message} />
                                    <TextField sx={{ mb: 2 }} label="Email *" type="email" fullWidth {...register("email")} error={!!errors.email} helperText={errors.email?.message} />
                                    <TextField sx={{ mb: 2 }} select label="Giới tính" fullWidth {...register("gender")} defaultValue="">
                                        <MenuItem value="Nam">Nam</MenuItem>
                                        <MenuItem value="Nữ">Nữ</MenuItem>
                                    </TextField>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField sx={{ mb: 2 }} label="Số điện thoại *" fullWidth {...register("phone")} error={!!errors.phone} helperText={errors.phone?.message} />
                                    <TextField sx={{ mb: 2 }} label="Ngày sinh" type="date" fullWidth {...register("birthDate")} InputLabelProps={{ shrink: true }} />
                                    <TextField sx={{ mb: 2 }} label="Lương *" type="number" fullWidth {...register("salary")} error={!!errors.salary} helperText={errors.salary?.message} />
                                    <TextField sx={{ mb: 2 }} label="Vị trí" fullWidth value="employ" disabled />
                                </Grid>
                            </Grid>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
                                {ability.can("create", "employee") &&
                                    (
                                    <Button variant="contained" sx={{ backgroundColor: "#E7B45A", color: "#000", "&:hover": { backgroundColor: "#d09e4f" } }} type="submit">
                                        Thêm
                                    </Button>
                                )}
                                <Button variant="outlined" sx={{ color: "#E7B45A", borderColor: "#E7B45A", "&:hover": { backgroundColor: "#f5d6a0" } }} onClick={() => navigate("/admins/list")}>
                                    Quay lại
                                </Button>
                            </Box>
                        </Box>
                    </Paper>
                </Container>
            </Box>
        </>
    );
}
