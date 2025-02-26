import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getNewsById, updateNews } from "../service/NewService";
import { uploadImageAndGetUrl } from "../service/CloudinaryService";
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    CircularProgress,
    Alert,
    IconButton,
    Grid,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import HeaderAdmin from "../component/admin/HeaderAdmin";
import { Helmet } from "react-helmet-async";

const primaryColor = "#E7B45A";

const NewsUpdateComponent = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // State cho tin tức, trạng thái, thông báo lỗi/thành công và dữ liệu form
    const [news, setNews] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    // State cho danh sách ảnh cũ (đã có trong DB) và ảnh mới (chưa upload)
    const [oldImages, setOldImages] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const [newImagePreviews, setNewImagePreviews] = useState([]);

    const fileInputRef = useRef(null);

    // Kiểm tra quyền admin khi component load
    useEffect(() => {
        const userRole = localStorage.getItem("role");
        if (userRole !== "admin" && userRole !== "employ") {
            navigate("/login");
        }
    }, [navigate]);

    // Lấy dữ liệu tin tức theo id
    useEffect(() => {
        const fetchNews = async () => {
            try {
                const data = await getNewsById(id);
                setNews(data);
                setTitle(data.title);
                setContent(data.content);
                if (data.images && data.images.length > 0) {
                    // Lưu trữ ảnh cũ dưới dạng mảng các đối tượng { id, img }
                    setOldImages(data.images);
                }
            } catch (err) {
                console.error("Error fetching news:", err);
                setError("Có lỗi xảy ra khi tải bài tin.");
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, [id]);

    // Xử lý chọn ảnh mới
    const handleImageChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const filesArray = Array.from(e.target.files);
            setNewImages((prev) => [...prev, ...filesArray]);
            const previews = filesArray.map((file) => URL.createObjectURL(file));
            setNewImagePreviews((prev) => [...prev, ...previews]);
            // Reset input file để cho phép chọn lại cùng file nếu cần
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    // Xoá ảnh cũ khỏi danh sách nếu người dùng không muốn cập nhật nữa
    const handleRemoveOldImage = (index) => {
        setOldImages((prev) => prev.filter((_, i) => i !== index));
    };

    // Xoá ảnh mới (chưa upload)
    const handleRemoveNewImage = (index) => {
        setNewImages((prev) => prev.filter((_, i) => i !== index));
        setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
    };

    // Xử lý submit cập nhật tin tức
    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdating(true);
        setError("");
        setMessage("");

        try {
            let uploadedNewImageUrls = [];
            if (newImages.length > 0) {
                const uploadPromises = newImages.map(async (image) => {
                    const url = await uploadImageAndGetUrl(image);
                    return url;
                });
                uploadedNewImageUrls = (await Promise.all(uploadPromises)).filter(
                    (url) => url !== null
                );
            }

            // Gộp danh sách ảnh: ảnh cũ (đã có id) và ảnh mới upload (chỉ có trường img)
            const combinedImages = [
                ...oldImages,
                ...uploadedNewImageUrls.map((url) => ({ img: url })),
            ];

            // Chuẩn bị payload cập nhật
            const newsDetails = {
                id: news.id,
                title,
                content,
                dateNews: news.dateNews, // Giữ nguyên ngày đăng ban đầu
                images: combinedImages,
            };

            await updateNews(id, newsDetails);
            setMessage("Bài tin đã được cập nhật thành công!");
            // Cập nhật lại dữ liệu tin sau khi update
            const updatedData = await getNewsById(id);
            setNews(updatedData);
            setTitle(updatedData.title);
            setContent(updatedData.content);
            setOldImages(updatedData.images || []);
            setNewImages([]);
            setNewImagePreviews([]);
            setTimeout(() => {
                navigate("/news");
            }, 2000);
        } catch (err) {
            console.error("Error updating news:", err);
            setError("Cập nhật bài tin thất bại.");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            <Helmet>
                <title>Cập nhật tin tức</title>
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
                            📝 Cập nhật bài tin
                        </Typography>

                        {error && (
                            <Alert severity="error" sx={{ mb: 3 }}>
                                {error}
                            </Alert>
                        )}
                        {message && (
                            <Alert severity="success" sx={{ mb: 3 }}>
                                {message}
                            </Alert>
                        )}

                        <Box component="form" onSubmit={handleSubmit} noValidate>
                            <TextField
                                label="Tiêu đề"
                                fullWidth
                                margin="normal"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                InputLabelProps={{ shrink: true }}
                            />
                            <TextField
                                label="Nội dung"
                                fullWidth
                                margin="normal"
                                multiline
                                rows={5}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                                InputLabelProps={{ shrink: true }}
                            />

                            {/* Hiển thị ảnh cũ */}
                            {oldImages.length > 0 && (
                                <Box sx={{ my: 2 }}>
                                    <Typography variant="subtitle1" sx={{ color: primaryColor, mb: 1 }}>
                                        Ảnh hiện tại:
                                    </Typography>
                                    <Grid container spacing={2}>
                                        {oldImages.map((img, index) => (
                                            <Grid
                                                item
                                                xs={6}
                                                sm={4}
                                                md={3}
                                                key={index}
                                                sx={{ position: "relative" }}
                                            >
                                                <img
                                                    src={img.img}
                                                    alt={`Ảnh hiện tại ${index + 1}`}
                                                    style={{
                                                        width: "100%",
                                                        height: "auto",
                                                        borderRadius: 8,
                                                        border: "1px solid #ddd",
                                                        padding: 4,
                                                    }}
                                                />
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleRemoveOldImage(index)}
                                                    sx={{
                                                        position: "absolute",
                                                        top: 5,
                                                        right: 5,
                                                        backgroundColor: "rgba(0,0,0,0.5)",
                                                    }}
                                                >
                                                    <DeleteIcon sx={{ color: "white" }} fontSize="small" />
                                                </IconButton>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>
                            )}

                            {/* Hiển thị ảnh mới đã chọn */}
                            {newImagePreviews.length > 0 && (
                                <Box sx={{ my: 2 }}>
                                    <Typography variant="subtitle1" sx={{ color: primaryColor, mb: 1 }}>
                                        Ảnh mới đã chọn:
                                    </Typography>
                                    <Grid container spacing={2}>
                                        {newImagePreviews.map((preview, index) => (
                                            <Grid
                                                item
                                                xs={6}
                                                sm={4}
                                                md={3}
                                                key={index}
                                                sx={{ position: "relative" }}
                                            >
                                                <img
                                                    src={preview}
                                                    alt={`Ảnh mới ${index + 1}`}
                                                    style={{
                                                        width: "100%",
                                                        height: "auto",
                                                        borderRadius: 8,
                                                        border: "1px solid #ddd",
                                                        padding: 4,
                                                    }}
                                                />
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleRemoveNewImage(index)}
                                                    sx={{
                                                        position: "absolute",
                                                        top: 5,
                                                        right: 5,
                                                        backgroundColor: "rgba(0,0,0,0.5)",
                                                    }}
                                                >
                                                    <DeleteIcon sx={{ color: "white" }} fontSize="small" />
                                                </IconButton>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>
                            )}

                            <Box sx={{ my: 2, display: "flex", alignItems: "center" }}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageChange}
                                    ref={fileInputRef}
                                    style={{ display: "none" }}
                                    id="select-new-images"
                                />
                                <label
                                    htmlFor="select-new-images"
                                    style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
                                >
                                    <IconButton color="primary" component="span">
                                        <PhotoCamera />
                                    </IconButton>
                                    <Typography variant="subtitle1" sx={{ color: primaryColor, ml: 1 }}>
                                        Chọn ảnh mới
                                    </Typography>
                                </label>
                            </Box>

                            <Box sx={{ mt: 4, position: "relative" }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                    disabled={updating}
                                    sx={{
                                        backgroundColor: primaryColor,
                                        color: "white",
                                        "&:hover": { backgroundColor: "#d1a750" },
                                        py: 1.5,
                                        fontSize: "1rem",
                                    }}
                                >
                                    {updating ? "Đang cập nhật..." : "Cập nhật bài tin"}
                                </Button>
                            </Box>
                        </Box>
                    </Paper>
                </Container>
            </Box>
        </>
    );
};

export default NewsUpdateComponent;
