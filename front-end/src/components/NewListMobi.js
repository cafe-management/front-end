import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getAllNews } from "../service/NewService";
import { connectWebSocketUser, disconnectWebSocket } from "../service/WebSocketService";
import {
    Container,
    Typography,
    CircularProgress,
    Box,
    Alert,
    Grid,
    useMediaQuery,
    Dialog,
    DialogTitle,
    DialogContent,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Footer from "../component/home/Footer";
import Header from "../component/home/Header";

const NewsListMobi = () => {
    const [newsList, setNewsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedNews, setSelectedNews] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [visibleNews, setVisibleNews] = useState(6); // Số lượng tin hiển thị ban đầu
    const isMobile = useMediaQuery("(max-width:600px)");

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const tableId = queryParams.get("tableId");

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await getAllNews(tableId);
                let newsData = response.data ? response.data : response;
                if (Array.isArray(newsData)) {
                    newsData = newsData.sort((a, b) => new Date(b.dateNews) - new Date(a.dateNews));
                    setNewsList(newsData);
                } else {
                    setError("Dữ liệu không đúng định dạng.");
                }
            } catch (err) {
                setError("Lỗi khi tải tin tức.");
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
        connectWebSocketUser(() => {
            fetchNews();
        });

        return () => {
            disconnectWebSocket();
        };
    }, [tableId]);

    useEffect(() => {
        if (selectedNews?.images?.length > 1) {
            const interval = setInterval(() => {
                setCurrentImageIndex((prevIndex) => (prevIndex + 1) % selectedNews.images.length);
            }, 2000);
            return () => clearInterval(interval);
        }
    }, [selectedNews]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
                setVisibleNews((prev) => prev + 6);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    return (
        <>
            <Header />
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3, textAlign: "center", color: "#C4975C" }}>
                    TIN TỨC
                </Typography>
                {newsList.length === 0 ? (
                    <Typography variant="h6" sx={{ textAlign: "center", color: "gray", mt: 4 }}>
                        Không có tin tức nào.
                    </Typography>
                ) : (
                    <Grid container spacing={2} justifyContent="center">
                        {newsList.slice(0, visibleNews).map((news) => (
                            <Grid item xs={12} sm={6} md={4} key={news.id}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        borderRadius: 2,
                                        overflow: "hidden",
                                        boxShadow: 3,
                                        cursor: "pointer",
                                        backgroundColor: "white",
                                        p: 2,
                                        height: "100%",
                                        textAlign: "center",
                                        minHeight: "300px"
                                    }}
                                    onClick={() => {
                                        setSelectedNews(news);
                                        setCurrentImageIndex(0);
                                    }}
                                >
                                    {news.images?.length > 0 ? (
                                        <img
                                            src={news.images[0].img}
                                            alt={news.title}
                                            style={{ width: "100%", height: "180px", objectFit: "cover", borderRadius: 8 }}
                                        />
                                    ) : (
                                        <Box sx={{ width: "100%", height: "180px", backgroundColor: "#ccc", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            Không có ảnh
                                        </Box>
                                    )}
                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="body2" sx={{ display: "flex", alignItems: "center", justifyContent: "center", color: "gray" }}>
                                            <CalendarMonthIcon fontSize="small" sx={{ mr: 1, color: "#C4975C" }} />
                                            {new Date(news.dateNews).toLocaleDateString()}
                                        </Typography>
                                        <Typography
                                            variant="h6"
                                            sx={{ fontWeight: "bold", mt: 1, overflow: "hidden", WebkitLineClamp: 2, display: "-webkit-box", WebkitBoxOrient: "vertical", minHeight: "48px" }}
                                        >
                                            {news.title || "Không có tiêu đề"}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{ color: "gray", mt: 1, overflow: "hidden", WebkitLineClamp: 3, display: "-webkit-box", WebkitBoxOrient: "vertical", minHeight: "60px" }}
                                        >
                                            {news.content}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                )}
                <Dialog open={Boolean(selectedNews)} onClose={() => setSelectedNews(null)} maxWidth="md" fullWidth>
                    <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", color: "#C4975C" }}>{selectedNews?.title}</DialogTitle>
                    <DialogContent>
                        {selectedNews?.images?.length > 0 && (
                            <img src={selectedNews.images[currentImageIndex].img} alt="Tin tức" style={{ width: "100%", height: "250px", objectFit: "cover" }} />
                        )}
                        <Typography variant="body1" sx={{ whiteSpace: "pre-wrap", mt: 2 }}>{selectedNews?.content}</Typography>
                        <Typography variant="caption" sx={{ display: "block", mt: 2, color: "gray", textAlign: "center" }}>
                            Ngày đăng: {new Date(selectedNews?.dateNews).toLocaleString()}
                        </Typography>
                    </DialogContent>
                </Dialog>
            </Container>
            <Footer />
        </>
    );
};

export default NewsListMobi;
