import React, { useEffect, useState } from "react";
import { Box, Button, Container, Paper, TextField, Typography, MenuItem, Grid } from "@mui/material";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { getAllRoles } from "../../service/RoleService";
import {checkAccount, createEmployee} from "../../service/UserService";
import {toast} from "react-toastify";
import HeaderAdmin from "./HeaderAdmin"; // Import roleService

export default function Register() {
    const navigate = useNavigate();
    const [roles, setRoles] = useState([]); // State lưu danh sách roles

    // Gọi API lấy danh sách role khi component mount
    useEffect(() => {
        const fetchRoles = async () => {
            const roleData = await getAllRoles();
            console.log("✅ Dữ liệu roleData từ API:", roleData);

            if (Array.isArray(roleData) && roleData.length > 0) {
                setRoles(roleData); // Cập nhật state
            } else {
                console.error("❌ API không trả về mảng hợp lệ!");
            }
        };
        fetchRoles();
    }, []);

    useEffect(() => {
        console.log("State roles sau khi set:", roles); // ✅ Kiểm tra state đã cập nhật chưa
    }, [roles]);

    // Schema Yup để validate form
    const schema = yup.object().shape({
        username: yup.string().required("Trường này không được để trống").min(6, "Tên tài khoản phải lớn hơn 6 ký tự"),
        fullName: yup.string().required("Trường này không được để trống"),
        address: yup.string().required("Trường này không được để trống"),
        email: yup.string().required("Trường này không được để trống").email("Email không hợp lệ"),
        phone: yup.string().required("Trường này không được để trống").matches(/^\d{10,11}$/, "Số điện thoại phải có 10-11 chữ số"),
        salary: yup.number().typeError("Lương phải là số").required("Trường này không được để trống").moreThan(0, "Lương phải lớn hơn 0"),
    });
    // useForm hook
    const { register, handleSubmit,
       setError, formState: { errors } } = useForm({ resolver: yupResolver(schema),
        defaultValues: {
            birthDate: "",
            gender: ""
        }
    });
    useEffect(() => {
        console.log("Errors:", errors);
    }, [errors]);
    console.log("Lỗi form:", errors);
    const getRoleId = (roleName, roles) => {
        if (!roles || roles.length === 0) {
            return null;
        }
        const role = roles.find(r => r.nameRoles === roleName);
        return role ? role.id : null;
    };
    const onSubmit = async (data, event) => {
        event.preventDefault();
        console.log("Dữ liệu gửi lên server trước khi chỉnh sửa:", data);
        const exists = await checkAccount(data.email, data.username);
        console.log("Dữ liệu trả về từ API checkAccount:", exists);
        if (!exists) {
            toast.error("Lỗi kiểm tra tài khoản, thử lại sau");
            return;
        }
        if (exists.existsUsername) {
            setError("username", {type: "manual", message: "Tên người dùng này đã tồn tại"});
            return;
        }
        if (exists.existsEmail) {
            setError("email", {type: "manual", message: "Email đã tồn tại"})
            return;
        }
        // Cập nhật lại dữ liệu trước khi gửi
        const roleObj = roles.find(r => r.nameRoles === data.role);
        const modifiedData = {
            ...data,
            birthDate: data.birthDate ? data.birthDate : "",
            gender: data.gender === "Nam" ? true : false,
            phoneNumber: data.phone,
            phone: undefined,
            account: {
                userName: data.username,
                email: data.email,
                role: {
                    id: 1,
                    nameRoles: "employ",
                },
            },
        };
        try {
            const response = await createEmployee(modifiedData);
            console.log("Phản hồi từ server:", response);
            if (response && response.id) {
                toast.success("Thêm nhân viên thành công!");
                setTimeout(() => {
                    navigate("/admins/list");
                }, 1500);
            } else {
                toast.error("Thêm nhân viên thất bại!");
            }
        } catch (error) {
            console.error("Lỗi khi thêm nhân viên:", error);
            toast.error("Lỗi khi thêm nhân viên!");
        }
    };
    return (
        <>
            <Helmet>
                <title>Thêm mới nhân viên</title>
            </Helmet>
            <HeaderAdmin/>
            <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "white" }}>
                <Container maxWidth="md"> {/* Tăng kích thước container để tránh cuộn */}
                    <Paper elevation={3} sx={{ padding: 4, borderRadius: 3, backgroundColor: "#fff" }}>
                        <Typography variant="h5" align="center" gutterBottom sx={{ color: "#000", fontWeight: "bold" }}>
                            Đăng ký tài khoản
                        </Typography>

                        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ flexGrow: 1 }}>
                            <Grid container spacing={2}>
                                       {/* Cột 1 */}
                                           <Grid item xs={12} sm={6}>
                                               <TextField sx={{ mb: 2 }} label={<RequiredLabel text="Tên tài khoản" />} fullWidth {...register("username")} error={!!errors.username} helperText={errors.username?.message} />
                                               <TextField sx={{ mb: 2 }} label={<RequiredLabel text="Tên đầy đủ" />} fullWidth {...register("fullName")} error={!!errors.fullName} helperText={errors.fullName?.message} />
                                               <TextField sx={{ mb: 2 }} label={<RequiredLabel text="Địa chỉ" />} fullWidth {...register("address")} error={!!errors.address} helperText={errors.address?.message} />
                                               <TextField sx={{ mb: 2 }} label={<RequiredLabel text="Email" />} type="email" fullWidth {...register("email")} error={!!errors.email} helperText={errors.email?.message} />
                                               <TextField sx={{ mb: 2 }} select label="Giới tính" fullWidth {...register("gender")} defaultValue = "">
                                                   <MenuItem value="Nam">Nam</MenuItem>
                                                   <MenuItem value="Nữ">Nữ</MenuItem>
                                               </TextField>
                                           </Grid>
                                           {/* Cột 2 */}
                                           <Grid item xs={12} sm={6}>
                                               <TextField sx={{ mb: 2 }} label={<RequiredLabel text="Số điện thoại" />} fullWidth {...register("phone")} error={!!errors.phone} helperText={errors.phone?.message} />
                                               <TextField sx={{ mb: 2 }} label="Ngày sinh" type="date" fullWidth {...register("birthDate")} InputLabelProps={{ shrink: true }} />
                                               <TextField sx={{ mb: 2 }} label={<RequiredLabel text="Lương" />} type="number" fullWidth {...register("salary")} error={!!errors.salary} helperText={errors.salary?.message} />
                                               <TextField
                                                   sx={{ mb: 2 }}
                                                   label={<RequiredLabel text="Vị trí" />}
                                                   fullWidth
                                                   value="employ"
                                                   disabled
                                               />
                                           </Grid>
                            </Grid>

                            {/* Nút bấm */}
                            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
                                <Button
                                    variant="contained"
                                    sx={{
                                        backgroundColor: "#E7B45A",
                                        color: "#000",
                                        "&:hover": { backgroundColor: "#d09e4f" }
                                    }}
                                    type="submit">
                                    Thêm
                                </Button>
                                <Button
                                    variant="outlined"
                                    sx={{
                                        color: "#E7B45A",
                                        borderColor: "#E7B45A",
                                        "&:hover": { backgroundColor: "#f5d6a0" }
                                    }}
                                    onClick={() => navigate("/admins/list")}
                                >
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

// Component thêm dấu * đỏ vào label
const RequiredLabel = ({ text }) => (
    <Typography>
        {text} <span style={{ color: "red" }}>*</span>
    </Typography>
);
