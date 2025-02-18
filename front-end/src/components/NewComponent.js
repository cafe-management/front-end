import React, { useState } from "react";
import axios from "axios";
import { createNews } from "../service/NewService";
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
    IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PhotoCamera from "@mui/icons-material/PhotoCamera";

const primaryColor = "#E7B45A";

const NewsCreateComponent = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [files, setFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const cloudName = "drszapjl6";
    const uploadPreset = "test_cloundinary";

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(selectedFiles);
        const previewUrls = selectedFiles.map((file) => URL.createObjectURL(file));
        setPreviews(previewUrls);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);
        setMessage("");

        try {
            const uploadedImages = [];

            for (const file of files) {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("upload_preset", uploadPreset);

                const cloudinaryResponse = await axios.post(
                    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                    formData
                );
                const { secure_url, public_id } = cloudinaryResponse.data;
                uploadedImages.push({ img: secure_url, public_id: public_id });
            }

            const newsData = {
                title,
                content,
                images: uploadedImages,
            };

            const savedNews = await createNews(newsData);

            setMessage("✅ Tin tức đã được đăng thành công!");
            setTitle("");
            setContent("");
            setFiles([]);
            setPreviews([]);

            setTimeout(() => {
                navigate("/news");
            }, 2000);
        } catch (error) {
            console.error("❌ Lỗi tạo tin tức:", error);
            setMessage("⚠️ Có lỗi xảy ra khi đăng tin tức.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3, border: `1px solid ${primaryColor}` }}>
                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{ color: primaryColor, fontWeight: "bold", textAlign: "center" }}
                >
                    📰 Đăng Tin Tức Mới
                </Typography>

                {message && (
                    <Alert severity={message.includes("thành công") ? "success" : "error"} sx={{ mb: 3 }}>
                        {message}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <TextField
                        label="📌 Tiêu đề"
                        fullWidth
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        label="📝 Nội dung"
                        fullWidth
                        multiline
                        rows={5}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                    />

                    {/* Upload Button */}
                    <Box display="flex" alignItems="center" mt={2}>
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
                            {files.length > 0 ? `${files.length} ảnh đã chọn` : "Chọn ảnh tải lên"}
                        </Typography>
                    </Box>

                    {/* Hiển thị ảnh đã chọn */}
                    {previews.length > 0 && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle1" sx={{ color: primaryColor }}>
                                📷 Xem trước ảnh:
                            </Typography>
                            <Grid container spacing={2} sx={{ mt: 1 }}>
                                {previews.map((url, index) => (
                                    <Grid item xs={4} sm={3} md={2} key={index}>
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
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    )}

                    {/* Nút Đăng Tin */}
                    <Box sx={{ mt: 4, position: "relative" }}>
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
                            {uploading ? "⏳ Đang tải lên..." : "🚀 Đăng Tin Tức"}
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
