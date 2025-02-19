import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import {Helmet} from "react-helmet-async";
import HeaderAdmin from "../component/admin/HeaderAdmin";

const NewsUpdateComponent = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [news, setNews] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    useEffect(() => {
        const userRole = localStorage.getItem("role"); // Hoặc lấy từ context, Redux...
        if (userRole !== "admin") {
            navigate("/login"); // Chuyển hướng nếu không phải admin
        }
    }, [navigate]);
    useEffect(() => {
        const fetchNews = async () => {
            try {
                const data = await getNewsById(id);
                setNews(data);
                setTitle(data.title);
                setContent(data.content);
            } catch (err) {
                console.error("Lỗi tải bài tin:", err);
                setError("Có lỗi xảy ra khi tải bài tin.");
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdating(true);
        setError("");
        setMessage("");

        try {
            const newsDetails = {
                title,
                content,
            };

            const updatedNews = await updateNews(id, newsDetails);
            setMessage("Bài tin đã được cập nhật thành công!");
            setTimeout(() => {
                navigate(`/news`);
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
            <HeaderAdmin/>
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
