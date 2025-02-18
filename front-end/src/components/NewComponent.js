import React, { useState } from "react";
import axios from "axios";
import { createNews } from "../service/NewService"; // API tạo tin tức
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Box,
    Grid,
    CircularProgress,
    Alert,
} from "@mui/material";

const primaryColor = "#E7B45A";

const NewsCreateComponent = () => {
    // State quản lý tiêu đề, nội dung, danh sách file ảnh và preview
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [files, setFiles] = useState([]); // Danh sách file được chọn
    const [previews, setPreviews] = useState([]); // Danh sách URL xem trước cho các ảnh
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");

    // Cấu hình Cloudinary
    const cloudName = "drszapjl6";
    const uploadPreset = "test_cloundinary";

    // Xử lý khi chọn nhiều file từ input
    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(selectedFiles);
        // Tạo preview cho từng file
        const previewUrls = selectedFiles.map((file) => URL.createObjectURL(file));
        setPreviews(previewUrls);
    };

    // Xử lý submit form tạo tin tức
    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);
        setMessage("");

        try {
            // Mảng lưu trữ thông tin các ảnh đã upload (định dạng cho ImageNews: {img, public_id})
            const uploadedImages = [];

            // Upload từng file lên Cloudinary
            for (const file of files) {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("upload_preset", uploadPreset);

                const cloudinaryResponse = await axios.post(
                    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                    formData
                );

                const { secure_url, public_id } = cloudinaryResponse.data;
                // Trường "img" của ImageNews nhận secure_url
                uploadedImages.push({ img: secure_url, public_id: public_id });
            }

            // Tạo đối tượng news với các thông tin và mảng ảnh
            const newsData = {
                title,
                content,
                images: uploadedImages,
            };

            // Gọi API tạo tin tức
            const savedNews = await createNews(newsData);

            setMessage("Tin tức đã được đăng thành công!");
            console.log("News created:", savedNews);

            // Reset form
            setTitle("");
            setContent("");
            setFiles([]);
            setPreviews([]);
        } catch (error) {
            console.error("Lỗi tạo tin tức:", error);
            setMessage("Có lỗi xảy ra khi đăng tin tức.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Paper
                elevation={3}
                sx={{
                    p: 3,
                    borderRadius: 2,
                    border: `1px solid ${primaryColor}`,
                }}
            >
                <Typography
                    variant="h5"
                    gutterBottom
                    sx={{ color: primaryColor, fontWeight: "bold" }}
                >
                    Đăng Tin Tức
                </Typography>
                {message && (
                    <Alert
                        severity={message.includes("thành công") ? "success" : "error"}
                        sx={{ mb: 2 }}
                    >
                        {message}
                    </Alert>
                )}
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <TextField
                        label="Tiêu đề"
                        fullWidth
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        label="Nội dung"
                        fullWidth
                        multiline
                        rows={4}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                    />
                    <Button
                        variant="contained"
                        component="label"
                        sx={{
                            mt: 2,
                            backgroundColor: primaryColor,
                            "&:hover": { backgroundColor: "#d1a750" },
                        }}
                    >
                        Chọn ảnh (nhiều file)
                        <input
                            type="file"
                            hidden
                            multiple
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </Button>
                    {previews.length > 0 && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle1" sx={{ color: primaryColor }}>
                                Preview các ảnh:
                            </Typography>
                            <Grid container spacing={2}>
                                {previews.map((url, index) => (
                                    <Grid item xs={6} sm={4} md={3} key={index}>
                                        <img
                                            src={url}
                                            alt={`preview-${index}`}
                                            style={{ width: "100%", borderRadius: 4 }}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    )}
                    <Box sx={{ mt: 3, position: "relative" }}>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={uploading}
                            fullWidth
                            sx={{
                                backgroundColor: primaryColor,
                                "&:hover": { backgroundColor: "#d1a750" },
                                py: 1.5,
                                fontSize: "1rem",
                            }}
                        >
                            {uploading ? "Đang upload..." : "Đăng Tin Tức"}
                        </Button>
                        {uploading && (
                            <CircularProgress
                                size={24}
                                sx={{
                                    color: primaryColor,
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    marginTop: "-12px",
                                    marginLeft: "-12px",
                                }}
                            />
                        )}
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default NewsCreateComponent;
