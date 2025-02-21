import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Container, Paper, Typography, TextField, Button, Box, Grid, IconButton, MenuItem
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { getCategories } from "../service/CategoryService";
import { addDrinks } from "../service/DrinkService";
import { Helmet } from "react-helmet-async";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const primaryColor = "#E7B45A";
const cloudName = "drszapjl6";
const uploadPreset = "test_cloundinary";

// Hàm tạo mã số món tự động
const generateDrinkCode = () => {
    const randomNumber = Math.floor(100 + Math.random() * 900); // Số ngẫu nhiên từ 100 đến 999
    return `TM-${randomNumber}`;
};

const DrinkCreateComponent = () => {
    const [drink, setDrink] = useState({ maSoMon: generateDrinkCode(), nameDrinks: "", price: "", category: "", imgDrinks: "" });
    const [categories, setCategories] = useState([]);
    const [files, setFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        getCategories().then(setCategories);
    }, []);

    const validate = () => {
        let newErrors = {};

        if (!drink.nameDrinks || drink.nameDrinks.length < 4) {
            newErrors.nameDrinks = "Tên món phải có ít nhất 4 ký tự.";
        }

        if (!drink.price || drink.price < 1000) {
            newErrors.price = "Giá phải lớn hơn 1000.";
        }

        if (!drink.category || drink.category === "") {
            newErrors.category = "Vui lòng chọn danh mục.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setDrink({ ...drink, [e.target.name]: e.target.value });

        // Khi người dùng nhập, kiểm tra lại lỗi và cập nhật
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: undefined });
        }
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles([...files, ...selectedFiles]);
        setPreviews([...previews, ...selectedFiles.map(URL.createObjectURL)]);
    };

    const uploadImages = async () =>
        Promise.all(
            files.map((file) => {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("upload_preset", uploadPreset);

                return axios.post(
                    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                    formData
                ).then(response => response.data.secure_url);
            })
        );

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);

        if (!validate()) {
            setUploading(false);
            return;
        }

        uploadImages()
            .then((uploadedImages) => {
                const drinkData = {
                    ...drink,
                    price: parseFloat(drink.price),
                    category: { id: drink.category },
                    imgDrinks: uploadedImages.length > 0 ? uploadedImages[0] : null,
                };

                return addDrinks(drinkData);
            })
            .then(() => {
                toast.success("Thêm món ăn thành công!");
                setTimeout(() => navigate("/admin/menu"), 2000); // Chờ 2 giây trước khi chuyển trang
            })
            .catch(() => {
                toast.error("Lỗi khi thêm món ăn!");
            })
            .finally(() => {
                setUploading(false);
            });
    };

    return (
        <>
            <Helmet>
                <title>Thêm Món Mới</title>
            </Helmet>
            <ToastContainer position="top-right" autoClose={3000} /> {/* Hiển thị thông báo */}

            <Container maxWidth="md" sx={{ mt: 10 }}>
                <Paper elevation={3} sx={{ p: 4, borderRadius: 3, border: `1px solid ${primaryColor}` }}>
                    <Typography variant="h4" gutterBottom sx={{ color: primaryColor, fontWeight: "bold", textAlign: "center" }}>
                        Thêm Món Mới
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <TextField
                            label="Mã Số Món"
                            fullWidth
                            name="maSoMon"
                            value={drink.maSoMon}
                            disabled
                            margin="normal"
                        />
                        <TextField
                            label="Tên Món"
                            fullWidth
                            name="nameDrinks"
                            value={drink.nameDrinks}
                            onChange={handleChange}
                            required
                            margin="normal"
                            error={!!errors.nameDrinks}
                            helperText={errors.nameDrinks || "Nhập tên món có ít nhất 4 ký tự"}
                        />
                        <TextField
                            label="Giá"
                            type="number"
                            fullWidth
                            name="price"
                            value={drink.price}
                            onChange={handleChange}
                            required
                            margin="normal"
                            error={!!errors.price}
                            helperText={errors.price || "Nhập giá lớn hơn 1000"}
                        />
                        <TextField
                            select
                            label="Danh Mục"
                            fullWidth
                            name="category"
                            value={drink.category}
                            onChange={handleChange}
                            required
                            margin="normal"
                            error={!!errors.category}
                            helperText={errors.category || "Chọn danh mục phù hợp"}
                        >
                            {categories.map((category) => (
                                <MenuItem key={category.id} value={category.id}>
                                    {category.nameCategory}
                                </MenuItem>
                            ))}
                        </TextField>

                        <Box display="flex" alignItems="center" mt={2}>
                            <input accept="image/*" id="file-upload" multiple type="file" hidden onChange={handleFileChange} />
                            <label htmlFor="file-upload">
                                <IconButton color="primary" component="span"><PhotoCamera /></IconButton>
                            </label>
                        </Box>

                        <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between" }}>
                            <Button
                                variant="contained"
                                sx={{
                                    backgroundColor: "#C4975C",
                                    color: "white",
                                    "&:hover": { backgroundColor: "#A87D4E" }
                                }}
                                onClick={() => navigate("/admin/menu")}
                            >
                                Quay Lại
                            </Button>

                            <Button
                                type="submit"
                                variant="contained"
                                disabled={uploading}
                                sx={{
                                    backgroundColor: primaryColor,
                                    color: "white",
                                    "&:hover": { backgroundColor: "#D1A750" }
                                }}
                            >
                                {uploading ? "Đang tải lên..." : "Thêm Món"}
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </>
    );
};

export default DrinkCreateComponent;
