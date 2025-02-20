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
    IconButton
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Footer from "../component/home/Footer";
import Header from "../component/home/Header";

const NewsListMobi = () => {
    const [newsList, setNewsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedNews, setSelectedNews] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [visibleNews, setVisibleNews] = useState(6);
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
        let intervalId;
        if (selectedNews?.images?.length > 1) {
            intervalId = setInterval(() => {
                setCurrentImageIndex((prevIndex) => (prevIndex + 1) % selectedNews.images.length);
            }, 5000);
        }

        // Dọn dẹp interval khi component unmount hoặc khi selectedNews thay đổi
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [selectedNews]);  // Chạy lại mỗi khi selectedNews thay đổi


    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
                setVisibleNews((prev) => prev + 6);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleNextImage = () => {
        if (selectedNews?.images?.length > 1) {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % selectedNews.images.length);
        }
    };

    const handlePrevImage = () => {
        if (selectedNews?.images?.length > 1) {
            setCurrentImageIndex((prevIndex) =>
                prevIndex === 0 ? selectedNews.images.length - 1 : prevIndex - 1
            );
        }
    };

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
                    <Grid container spacing={5} justifyContent="center">
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
                                        <Typography variant="h6" sx={{ fontWeight: "bold", mt: 1 }}>
                                            {news.title || "Không có tiêu đề"}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                )}
                <Dialog open={Boolean(selectedNews)} onClose={() => setSelectedNews(null)} maxWidth="md" fullWidth>
                    <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", color: "#C4975C" }}>
                        {selectedNews?.title}
                    </DialogTitle>
                    <DialogContent>
                        {selectedNews?.images?.length > 0 && (
                            <Box sx={{ position: "relative", textAlign: "center" }}>
                                <IconButton
                                    sx={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", backgroundColor: "rgba(0,0,0,0.5)", color: "white" }}
                                    onClick={handlePrevImage}
                                >
                                    <ArrowBackIosIcon />
                                </IconButton>
                                <img
                                    src={selectedNews.images[currentImageIndex].img}
                                    alt="Tin tức"
                                    style={{ width: "100%", height: "250px", objectFit: "cover", borderRadius: 8 }}
                                />
                                <IconButton
                                    sx={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", backgroundColor: "rgba(0,0,0,0.5)", color: "white" }}
                                    onClick={handleNextImage}
                                >
                                    <ArrowForwardIosIcon />
                                </IconButton>
                            </Box>
                        )}
                        <Typography variant="body1" sx={{ mt: 2 }}>
                            {selectedNews?.content || "Không có nội dung"}
                        </Typography>
                    </DialogContent>

                </Dialog>
            </Container>
            <Footer />
        </>
    );
};

export default NewsListMobi;
