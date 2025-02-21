import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getNewsById, updateNews } from "../service/NewService";
import {uploadImageAndGetUrl} from "../service/CloudinaryService";
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
import DeleteIcon from "@mui/icons-material/Delete";
import HeaderAdmin from "../component/admin/HeaderAdmin";
import { Helmet } from "react-helmet-async";

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
        if (userRole !== "admin") {
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
            console.log("newImages:", newImages);
            if (newImages.length > 0) {
                const uploadPromises = newImages.map(async (image) => {
                    const url = await uploadImageAndGetUrl(image);
                    console.log("Upload result:", url);
                    return url;
                });
                uploadedNewImageUrls = (await Promise.all(uploadPromises)).filter((url) => url !== null);
                console.log("Uploaded new image URLs:", uploadedNewImageUrls);
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

            console.log("Payload cập nhật:", newsDetails);
            await updateNews(id, newsDetails);
            setMessage("Bài tin đã được cập nhật thành công!");
            console.log("Payload cập nhật:", newsDetails);
            // Sau khi cập nhật, gọi lại API để lấy dữ liệu mới
            const updatedData = await getNewsById(id);
            setNews(updatedData);
            setTitle(updatedData.title);
            setContent(updatedData.content);
            setOldImages(updatedData.images || []);

            setNewImages([]);
            setNewImagePreviews([]);

            // Chuyển hướng sau vài giây
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

                    {/* Hiển thị danh sách ảnh mới đã chọn với nút xoá */}
                    {newImagePreviews.length > 0 && (
                        <Box sx={{ my: 2 }}>
                            <Typography variant="subtitle1">
                                Ảnh mới đã chọn:
                            </Typography>
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
