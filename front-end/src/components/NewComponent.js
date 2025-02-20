import React, { useEffect, useState } from "react";
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
    Alert,
    IconButton
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import DeleteIcon from "@mui/icons-material/Delete";
import HeaderAdmin from "../component/admin/HeaderAdmin";
import { Helmet } from "react-helmet-async";

// Import react-draft-wysiwyg và draft-js
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const primaryColor = "#E7B45A";

const NewsCreateComponent = () => {
    const [title, setTitle] = useState("");
    // Sử dụng EditorState của Draft.js cho nội dung
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [files, setFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");
    const cloudName = "drszapjl6";
    const uploadPreset = "test_cloundinary";
    const navigate = useNavigate();
    const userRole = localStorage.getItem("role");

    useEffect(() => {
        if (userRole !== "admin") {
            navigate("/login");
        }
    }, [userRole, navigate]);

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles([...files, ...selectedFiles]);
        const previewUrls = selectedFiles.map((file) => URL.createObjectURL(file));
        setPreviews([...previews, ...previewUrls]);
    };

    const handleRemoveImage = (index) => {
        const updatedFiles = files.filter((_, i) => i !== index);
        const updatedPreviews = previews.filter((_, i) => i !== index);
        setFiles(updatedFiles);
        setPreviews(updatedPreviews);
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
                uploadedImages.push({ img: secure_url, public_id });
            }

            // Chuyển đổi nội dung từ Draft.js sang JSON
            const contentState = editorState.getCurrentContent();
            const rawContent = convertToRaw(contentState);

            const newsData = {
                title,
                content: rawContent, // hoặc chuyển đổi thành HTML nếu backend yêu cầu
                images: uploadedImages,
            };

            await createNews(newsData);

            setMessage("✅ Tin tức đã được đăng thành công!");
            setTitle("");
            setEditorState(EditorState.createEmpty());
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
        <>
            <Helmet>
                <title>Đăng Tin Tức Mới</title>
            </Helmet>
            <HeaderAdmin />
            <Container maxWidth="md" sx={{ mt: 10 }}>
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

                        <Box sx={{ border: "1px solid #ccc", borderRadius: 2, p: 2, minHeight: 150, mt: 2 }}>
                            <Typography variant="subtitle1" sx={{ mb: 1, color: primaryColor }}>
                                📝 Nội dung
                            </Typography>
                            <Editor
                                editorState={editorState}
                                onEditorStateChange={setEditorState}
                                placeholder="Nhập nội dung tin tức..."
                                toolbar={{
                                    options: [
                                        "inline",
                                        "blockType",
                                        "fontSize",
                                        "fontFamily",
                                        "colorPicker",
                                        "list",
                                        "textAlign",
                                        "link",
                                        "emoji",
                                        "history",
                                    ],
                                }}
                            />
                        </Box>

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

                        {previews.length > 0 && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="subtitle1" sx={{ color: primaryColor }}>
                                    📷 Xem trước ảnh:
                                </Typography>
                                <Grid container spacing={2} sx={{ mt: 1 }}>
                                    {previews.map((url, index) => (
                                        <Grid item xs={4} sm={3} md={2} key={index} position="relative">
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
                                                sx={{ position: "absolute", top: 5, right: 5, background: "rgba(0,0,0,0.5)" }}
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
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </>
    );
};

export default NewsCreateComponent;
