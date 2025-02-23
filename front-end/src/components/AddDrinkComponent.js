import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Box,
    Grid,
    IconButton,
    MenuItem,
    Alert,
    Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import DeleteIcon from "@mui/icons-material/Delete";
import { Helmet } from "react-helmet-async";
import HeaderAdmin from "../component/admin/HeaderAdmin";
import { getCategories } from "../service/CategoryService";
import { addDrinks } from "../service/DrinkService";
import { NumericFormat } from "react-number-format";

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
        imgDrinks: "",
    });
    const [categories, setCategories] = useState([]);
    const [files, setFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");
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

                return response.data.public_id;
            })
        );

        return uploadedImages.length > 0 ? uploadedImages[0] : null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);
        setMessage("");

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
                imgDrinks: imagePublicId || null,
            };

            await addDrinks(drinkData);
            setMessage("✅ Thêm món ăn thành công!");

            // Reset lại form
            setFiles([]);
            setPreviews([]);
            setDrink({
                maSoMon: generateDrinkCode(),
                nameDrinks: "",
                price: "",
                category: "",
                imgDrinks: "",
            });

            setTimeout(() => navigate("/admin/menu"), 2000);
        } catch (error) {
            setMessage("⚠️ Lỗi khi thêm món ăn!");
        } finally {
            setUploading(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>Thêm Món Mới</title>
            </Helmet>

            <HeaderAdmin />

            <Box
                sx={{
                    pt: 10,
                    pb: 10,
                    minHeight: "calc(100vh - 64px)",
                    backgroundColor: "#f5f5f5",
                }}
            >
                <Container maxWidth="sm">
                    <Paper
                        elevation={3}
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            border: `1px solid ${primaryColor}`,
                        }}
                    >
                        <Typography
                            variant="h5"
                            gutterBottom
                            sx={{
                                color: primaryColor,
                                fontWeight: "bold",
                                textAlign: "center",
                            }}
                        >
                            🍽️ Thêm Món Mới
                        </Typography>

                        {message && (
                            <Alert
                                severity={
                                    message.includes("thành công") ? "success" : "error"
                                }
                                sx={{ mb: 3 }}
                            >
                                {message}
                            </Alert>
                        )}

                        <Box component="form" onSubmit={handleSubmit} noValidate>
                            <Stack spacing={2}>
                                <TextField
                                    label="Mã Số Món"
                                    fullWidth
                                    name="maSoMon"
                                    value={drink.maSoMon}
                                    disabled
                                    InputLabelProps={{ shrink: true }}
                                />
                                <TextField
                                    label="Tên Món"
                                    fullWidth
                                    name="nameDrinks"
                                    value={drink.nameDrinks}
                                    onChange={handleChange}
                                    required
                                    error={!!errors.nameDrinks}
                                    helperText={
                                        errors.nameDrinks ||
                                        "Nhập tên món có ít nhất 4 ký tự."
                                    }
                                    InputLabelProps={{ shrink: true }}
                                />
                                <NumericFormat
                                    customInput={TextField}
                                    label="Giá"
                                    name="price"
                                    value={drink.price}
                                    thousandSeparator="."
                                    decimalSeparator=","
                                    onValueChange={(values) => {
                                        setDrink({ ...drink, price: values.value });
                                        if (errors.price) {
                                            setErrors({ ...errors, price: undefined });
                                        }
                                    }}
                                    required
                                    error={!!errors.price}
                                    helperText={errors.price || "Nhập giá lớn hơn 1000."}
                                    InputLabelProps={{ shrink: true }}
                                />
                                <TextField
                                    select
                                    label="Danh Mục"
                                    fullWidth
                                    name="category"
                                    value={drink.category}
                                    onChange={handleChange}
                                    required
                                    error={!!errors.category}
                                    helperText={
                                        errors.category || "Chọn danh mục phù hợp."
                                    }
                                    InputLabelProps={{ shrink: true }}
                                >
                                    {categories.map((category) => (
                                        <MenuItem key={category.id} value={category.id}>
                                            {category.nameCategory}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Stack>

                            <Box display="flex" alignItems="center" mt={3}>
                                <input
                                    accept="image/*"
                                    id="file-upload"
                                    multiple
                                    type="file"
                                    hidden
                                    onChange={handleFileChange}
                                />
                                <label htmlFor="file-upload">
                                    <IconButton color="primary" component="span">
                                        <PhotoCamera />
                                    </IconButton>
                                </label>
                                <Typography variant="body1" color="textSecondary">
                                    {files.length > 0
                                        ? `${files.length} ảnh đã chọn`
                                        : "Chọn ảnh tải lên"}
                                </Typography>
                            </Box>

                            {previews.length > 0 && (
                                <Box sx={{ mt: 2 }}>
                                    <Typography
                                        variant="subtitle1"
                                        sx={{ color: primaryColor }}
                                    >
                                        📷 Xem trước ảnh:
                                    </Typography>
                                    <Grid container spacing={2} sx={{ mt: 1 }}>
                                        {previews.map((url, index) => (
                                            <Grid
                                                item
                                                xs={4}
                                                sm={3}
                                                md={2}
                                                key={index}
                                                position="relative"
                                            >
                                                <img
                                                    src={url}
                                                    alt={`preview-${index}`}
                                                    style={{
                                                        width: "100%",
                                                        height: "auto",
                                                        borderRadius: 8,
                                                        border: "1px solid #ddd",
                                                        padding: 2,
                                                    }}
                                                />
                                                <IconButton
                                                    sx={{
                                                        position: "absolute",
                                                        top: 5,
                                                        right: 5,
                                                        background: "rgba(0,0,0,0.5)",
                                                    }}
                                                    size="small"
                                                    onClick={() => handleRemoveImage(index)}
                                                >
                                                    <DeleteIcon sx={{ color: "white" }} />
                                                </IconButton>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>
                            )}

                            <Box sx={{ mt: 4 }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={uploading}
                                    fullWidth
                                    sx={{
                                        backgroundColor: primaryColor,
                                        color: "white",
                                        py: 1.5,
                                        fontSize: "1rem",
                                    }}
                                >
                                    {uploading ? "⏳ Đang tải lên..." : "Thêm Món"}
                                </Button>
                            </Box>
                        </Box>
                    </Paper>
                </Container>
            </Box>
        </>
    );
};

export default DrinkCreateComponent;
