import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getNewsById, updateNews } from "../service/NewService";
import {
    Container,
    TextField,
    Button,
    Typography,
    Box,
    CircularProgress,
    Alert,
    IconButton,
} from "@mui/material";
import { Helmet } from "react-helmet-async";
import HeaderAdmin from "../component/admin/HeaderAdmin";
import { uploadImageToCloudinary } from "../service/CloudinaryService";
import DeleteIcon from "@mui/icons-material/Delete";

const NewsUpdateComponent = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // State của bài tin
    const [news, setNews] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    // Ảnh cũ: lưu dưới dạng mảng các đối tượng { id, img }
    const [oldImages, setOldImages] = useState([]);
    // Ảnh mới: lưu danh sách file và URL preview tương ứng
    const [newImages, setNewImages] = useState([]);
    const [newImagePreviews, setNewImagePreviews] = useState([]);

    const fileInputRef = useRef(null);

    // Kiểm tra quyền truy cập (admin)
    useEffect(() => {
        const userRole = localStorage.getItem("role");
        if (userRole !== "admin") {
            navigate("/login");
        }
    }, [navigate]);

    // Lấy dữ liệu bài tin theo id
    useEffect(() => {
        const fetchNews = async () => {
            try {
                const data = await getNewsById(id);
                setNews(data);
                setTitle(data.title);
                setContent(data.content);
                if (data.images && data.images.length > 0) {
                    // Lưu ảnh cũ theo dạng: { id, img } (dùng luôn trường img từ API)
                    const imagesArr = data.images.map(({ id, img }) => ({ id, img }));
                    setOldImages(imagesArr);
                }
            } catch (err) {
                console.error("Lỗi tải bài tin:", err);
                setError("Có lỗi xảy ra khi tải bài tin.");
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, [id]);

    // Xử lý chọn nhiều ảnh mới
    const handleImageChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const filesArray = Array.from(e.target.files);
            setNewImages((prev) => [...prev, ...filesArray]);
            const previews = filesArray.map((file) => URL.createObjectURL(file));
            setNewImagePreviews((prev) => [...prev, ...previews]);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    // Xoá ảnh cũ theo index
    const handleRemoveOldImage = (index) => {
        const updated = oldImages.filter((_, i) => i !== index);
        setOldImages(updated);
    };

    // Xoá ảnh mới (chưa upload) theo index
    const handleRemoveNewImage = (index) => {
        const updatedFiles = newImages.filter((_, i) => i !== index);
        const updatedPreviews = newImagePreviews.filter((_, i) => i !== index);
        setNewImages(updatedFiles);
        setNewImagePreviews(updatedPreviews);
    };

    // Xử lý submit cập nhật bài tin
    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdating(true);
        setError("");
        setMessage("");

        try {
            let uploadedNewImageUrls = [];
            if (newImages.length > 0) {
                const uploadPromises = newImages.map(async (image) => {
                    const result = await uploadImageToCloudinary(image);
                    if (result && result.secure_url) {
                        return result.secure_url;
                    }
                    return null;
                });
                uploadedNewImageUrls = (await Promise.all(uploadPromises)).filter(
                    (url) => url !== null
                );
            }

            const combinedImages = [
                ...oldImages.map((img) => ({ id: img.id, img: img.img })),
                ...uploadedNewImageUrls.map((url) => ({ img: url })),
            ];


            const newsDetails = {
                id: news.id,
                title,
                content,
                dateNews: news.dateNews,
                images: combinedImages,
            };

            console.log("Payload cập nhật:", newsDetails);
            await updateNews(id, newsDetails);
            setMessage("Bài tin đã được cập nhật thành công!");
// Sau update, gọi lại API để lấy dữ liệu mới
            const updatedData = await getNewsById(id);
            setNews(updatedData);
            setTitle(updatedData.title);
            setContent(updatedData.content);

// Kiểm tra nếu updatedData.images có giá trị thì cập nhật
            if (Array.isArray(updatedData.images) && updatedData.images.length > 0) {
                setOldImages(updatedData.images.map(({ id, img }) => ({ id, img })));
            } else {
                setOldImages([]); // Đảm bảo oldImages không bị lỗi nếu không có ảnh nào
            }

// Xóa ảnh mới đã upload để tránh lưu lại ảnh cũ trong state
            setNewImages([]);
            setNewImagePreviews([]);

            setTimeout(() => {
                navigate("/news");
            }, 2000);

        } catch (err) {
            console.error("Lỗi cập nhật bài tin:", err);
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

    if (error && !news) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    return (
        <>
            <Helmet>
                <title>Cập nhật tin tức</title>
            </Helmet>
            <HeaderAdmin />
            <Container maxWidth="md" sx={{ mt: 10 }}>
                <Typography variant="h4" gutterBottom>
                    Cập nhật bài tin
                </Typography>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                {message && (
                    <Alert severity="success" sx={{ mb: 2 }}>
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
                    />
                    <TextField
                        label="Nội dung"
                        fullWidth
                        margin="normal"
                        multiline
                        rows={4}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />

                    {/* Hiển thị danh sách ảnh cũ với nút xoá */}
                    {oldImages.length > 0 && (
                        <Box sx={{ my: 2 }}>
                            <Typography variant="subtitle1">Ảnh hiện tại:</Typography>
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 1 }}>
                                {oldImages.map((img, index) => (
                                    <Box key={index} position="relative">
                                        <img
                                            src={img.img}
                                            alt={`Ảnh hiện tại ${index + 1}`}
                                            style={{ maxWidth: "200px", height: "auto" }}
                                        />
                                        <IconButton
                                            size="small"
                                            onClick={() => handleRemoveOldImage(index)}
                                            sx={{
                                                position: "absolute",
                                                top: 0,
                                                right: 0,
                                                backgroundColor: "rgba(0,0,0,0.5)",
                                                color: "white",
                                            }}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    )}

                    {/* Hiển thị danh sách preview ảnh mới với nút xoá */}
                    {newImagePreviews.length > 0 && (
                        <Box sx={{ my: 2 }}>
                            <Typography variant="subtitle1">Ảnh mới chọn:</Typography>
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 1 }}>
                                {newImagePreviews.map((preview, index) => (
                                    <Box key={index} position="relative">
                                        <img
                                            src={preview}
                                            alt={`Ảnh mới ${index + 1}`}
                                            style={{ maxWidth: "200px", height: "auto" }}
                                        />
                                        <IconButton
                                            size="small"
                                            onClick={() => handleRemoveNewImage(index)}
                                            sx={{
                                                position: "absolute",
                                                top: 0,
                                                right: 0,
                                                backgroundColor: "rgba(0,0,0,0.5)",
                                                color: "white",
                                            }}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    )}

                    <Box sx={{ my: 2 }}>
                        <Typography variant="subtitle1">
                            Chọn ảnh mới (có thể chọn nhiều ảnh):
                        </Typography>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageChange}
                            ref={fileInputRef}
                            style={{ marginTop: 8 }}
                        />
                    </Box>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={updating}
                        sx={{ mt: 2 }}
                    >
                        {updating ? "Đang cập nhật..." : "Cập nhật bài tin"}
                    </Button>
                </Box>
            </Container>
        </>
    );
};

export default NewsUpdateComponent;
