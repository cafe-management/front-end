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
import DeleteIcon from "@mui/icons-material/Delete";

const primaryColor = "#E7B45A";
const cloudName = "drszapjl6";
const uploadPreset = "test_cloundinary";

// Hàm tạo mã số món tự động
const generateDrinkCode = () => {
    const randomNumber = Math.floor(100 + Math.random() * 900);
    return `TM-${randomNumber}`;
};

const DrinkCreateComponent = () => {
    const [drink, setDrink] = useState({
        maSoMon: generateDrinkCode(),
        nameDrinks: "",
        price: "",
        category: "",
        imgDrinks: ""
    });

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

    const handleRemoveImage = (index) => {
        setFiles(files.filter((_, i) => i !== index));
        setPreviews(previews.filter((_, i) => i !== index));
    };

    const uploadImages = async () => {
        if (files.length === 0) return null;

        const uploadedImages = await Promise.all(
            files.map(async (file) => {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("upload_preset", uploadPreset);

                const response = await axios.post(
                    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                    formData
                );

                return response.data.public_id; // Lấy public_id thay vì secure_url
            })
        );

        return uploadedImages.length > 0 ? uploadedImages[0] : null;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);

        if (!validate()) {
            setUploading(false);
            return;
        }

        try {
            const imagePublicId = await uploadImages();

            const drinkData = {
                ...drink,
                price: parseFloat(drink.price),
                category: { id: drink.category },
                imgDrinks: imagePublicId || null, // Lưu public_id thay vì URL ảnh
            };

            await addDrinks(drinkData);
            toast.success("Thêm món ăn thành công!");

            // Xóa danh sách ảnh sau khi thêm món
            setFiles([]);
            setPreviews([]);
            setDrink({ maSoMon: generateDrinkCode(), nameDrinks: "", price: "", category: "", imgDrinks: "" });

            setTimeout(() => navigate("/admin/menu"), 2000);
        } catch (error) {
            toast.error("Lỗi khi thêm món ăn!");
        } finally {
            setUploading(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>Thêm Món Mới</title>
            </Helmet>
            <ToastContainer position="top-right" autoClose={3000} />

            <Container maxWidth="md" sx={{ mt: 10 }}>
                <Paper elevation={3} sx={{ p: 4, borderRadius: 3, border: `1px solid ${primaryColor}` }}>
                    <Typography variant="h4" gutterBottom sx={{ color: "black", fontWeight: "bold", textAlign: "center" }}>
                        Thêm Món Mới
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <TextField label="Mã Số Món" fullWidth name="maSoMon" value={drink.maSoMon} disabled margin="normal" />
                        <TextField label="Tên Món" fullWidth name="nameDrinks" value={drink.nameDrinks} onChange={handleChange} required margin="normal" error={!!errors.nameDrinks} helperText={errors.nameDrinks || "Nhập tên món có ít nhất 4 ký tự"} />
                        <TextField label="Giá" type="number" fullWidth name="price" value={drink.price} onChange={handleChange} required margin="normal" error={!!errors.price} helperText={errors.price || "Nhập giá lớn hơn 1000"} />
                        <TextField select label="Danh Mục" fullWidth name="category" value={drink.category} onChange={handleChange} required margin="normal" error={!!errors.category} helperText={errors.category || "Chọn danh mục phù hợp"}>
                            {categories.map((category) => (
                                <MenuItem key={category.id} value={category.id}>
                                    {category.nameCategory}
                                </MenuItem>
                            ))}
                        </TextField>

                        <Box sx={{ mt: 2 }}>
                            <input accept="image/*" id="file-upload" multiple type="file" hidden onChange={handleFileChange} />
                            <label htmlFor="file-upload">
                                <IconButton color="primary" component="span">
                                    <PhotoCamera />
                                </IconButton>
                            </label>
                        </Box>

                        <Box sx={{ mt: 2 }}>
                            <Grid container spacing={2}>
                                {previews.map((url, index) => (
                                    <Grid item key={index} xs={4} position="relative">
                                        <img src={url} alt={`preview-${index}`} style={{ width: "100%", borderRadius: 8, border: "1px solid #ddd", padding: 2 }} />
                                        <IconButton sx={{ position: "absolute", top: 5, right: 5, background: "rgba(0,0,0,0.5)" }} size="small" onClick={() => handleRemoveImage(index)}>
                                            <DeleteIcon sx={{ color: "white" }} />
                                        </IconButton>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>

                        <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between" }}>
                            <Button variant="contained" sx={{ backgroundColor: "#C4975C", color: "white" }} onClick={() => navigate("/admin/menu")}>Quay Lại</Button>
                            <Button type="submit" variant="contained" disabled={uploading} sx={{ backgroundColor: primaryColor, color: "white" }}>{uploading ? "Đang tải lên..." : "Thêm Món"}</Button>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </>
    );
};

export default DrinkCreateComponent;
