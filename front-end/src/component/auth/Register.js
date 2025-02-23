import React, { useEffect } from "react";
import { Box, Button, Container, Paper, TextField, Typography, MenuItem, Grid } from "@mui/material";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAbility } from "../../Can";
import { checkAccount, createEmployee } from "../../service/UserService";
import { toast } from "react-toastify";
import HeaderAdmin from "../admin/HeaderAdmin";
import { NumericFormat } from "react-number-format";

const primaryColor = "#E7B45A";

export default function Register() {
    const navigate = useNavigate();
    const { ability } = useAbility();

    useEffect(() => {
        const role = localStorage.getItem("role");
        if (role !== "admin") {
            navigate("/login");
        }
    }, [navigate]);

    const schema = yup.object().shape({
        username: yup
            .string()
            .required("Không được để trống")
            .min(6, "Tên tài khoản ít nhất 6 ký tự"),
        fullName: yup.string().required("Không được để trống"),
        address: yup.string().required("Không được để trống"),
        email: yup.string().required("Không được để trống").email("Email không hợp lệ"),
        phone: yup
            .string()
            .required("Không được để trống")
            .matches(/^\d{10,11}$/, "Số điện thoại phải có 10-11 chữ số"),
        salary: yup
            .number()
            .typeError("Lương phải là số")
            .required("Không được để trống")
            .moreThan(0, "Lương phải lớn hơn 0"),
    });

    const { register, handleSubmit, control, setError, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: { birthDate: "", gender: "", salary: "" }
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
                setTimeout(() => navigate("/admin/list"), 1500);
            } else {
                toast.error("Thêm nhân viên thất bại!");
            }
        } catch (error) {
            toast.error("Lỗi khi thêm nhân viên!");
        }
    };

    return (
        <>
            <Helmet>
                <title>Thêm mới nhân viên</title>
            </Helmet>
            <HeaderAdmin />
            <Box
                sx={{
                    pt: 10,
                    pb: 10,
                    minHeight: "calc(100vh - 64px)",
                    backgroundColor: "#f5f5f5",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <Container maxWidth="sm">
                    <Paper
                        elevation={3}
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            border: `1px solid ${primaryColor}`,
                            backgroundColor: "#fff"
                        }}
                    >
                        <Typography
                            variant="h5"
                            align="center"
                            gutterBottom
                            sx={{ color: primaryColor, fontWeight: "bold" }}
                        >
                            Đăng ký tài khoản
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 2 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Tên tài khoản *"
                                        fullWidth
                                        {...register("username")}
                                        error={!!errors.username}
                                        helperText={errors.username?.message}
                                    />
                                    <TextField
                                        sx={{ mt: 2 }}
                                        label="Tên đầy đủ *"
                                        fullWidth
                                        {...register("fullName")}
                                        error={!!errors.fullName}
                                        helperText={errors.fullName?.message}
                                    />
                                    <TextField
                                        sx={{ mt: 2 }}
                                        label="Địa chỉ *"
                                        fullWidth
                                        {...register("address")}
                                        error={!!errors.address}
                                        helperText={errors.address?.message}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Email *"
                                        type="email"
                                        fullWidth
                                        {...register("email")}
                                        error={!!errors.email}
                                        helperText={errors.email?.message}
                                    />
                                    <TextField
                                        sx={{ mt: 2 }}
                                        label="Số điện thoại *"
                                        fullWidth
                                        {...register("phone")}
                                        error={!!errors.phone}
                                        helperText={errors.phone?.message}
                                    />
                                    <TextField
                                        sx={{ mt: 2 }}
                                        label="Ngày sinh"
                                        type="date"
                                        fullWidth
                                        {...register("birthDate")}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Controller
                                        name="salary"
                                        control={control}
                                        render={({ field }) => (
                                            <NumericFormat
                                                {...field}
                                                customInput={TextField}
                                                label="Lương *"
                                                fullWidth
                                                thousandSeparator="."
                                                decimalSeparator=","
                                                prefix="VND "
                                                error={!!errors.salary}
                                                helperText={errors.salary?.message}
                                                onValueChange={(values) => {
                                                    field.onChange(values.floatValue);
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        select
                                        label="Giới tính"
                                        fullWidth
                                        defaultValue=""
                                        {...register("gender")}
                                    >
                                        <MenuItem value="Nam">Nam</MenuItem>
                                        <MenuItem value="Nữ">Nữ</MenuItem>
                                    </TextField>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Vị trí"
                                        fullWidth
                                        value="employ"
                                        disabled
                                    />
                                </Grid>
                            </Grid>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
                                {ability.can("create", "employee") && (
                                    <Button
                                        variant="contained"
                                        sx={{
                                            backgroundColor: primaryColor,
                                            color: "#fff",
                                            "&:hover": { backgroundColor: "#d09e4f" }
                                        }}
                                        type="submit"
                                    >
                                        Thêm
                                    </Button>
                                )}
                                <Button
                                    variant="outlined"
                                    sx={{
                                        color: primaryColor,
                                        borderColor: primaryColor,
                                        "&:hover": { backgroundColor: "#f5d6a0" }
                                    }}
                                    onClick={() => navigate("/admin/list")}
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
