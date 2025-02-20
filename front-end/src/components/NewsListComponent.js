import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllNews, deleteNews } from "../service/NewService";
import { connectWebSocketUser, disconnectWebSocket } from "../service/WebSocketService";
import {
    Modal,
    Container,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    CircularProgress,
    Box,
    Alert,
    Button,
    Paper,
    IconButton,
    Pagination,
    CardMedia,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Helmet } from "react-helmet-async";
import HeaderAdmin from "../component/admin/HeaderAdmin";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const NewsListComponent = () => {
    const [newsList, setNewsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [openModal, setOpenModal] = useState(false);
    const [selectedNews, setSelectedNews] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchNews();
        connectWebSocketUser(() => {
            fetchNews();
        });
        return () => {
            disconnectWebSocket();
        };
    }, []);

    const fetchNews = async () => {
        try {
            const response = await getAllNews();
            let newsData = response.data || response;
            if (Array.isArray(newsData)) {
                newsData = newsData.sort((a, b) => new Date(b.dateNews) - new Date(a.dateNews));
                setNewsList(newsData);
            } else {
                setError("Dữ liệu không đúng định dạng.");
            }
        } catch (err) {
            setError("Có lỗi xảy ra khi tải tin tức.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteNews(id);
            setNewsList((prev) => prev.filter((news) => news.id !== id));
        } catch (err) {
            alert("Xóa bài tin thất bại.");
        }
    };

    const handleOpenModal = (news) => {
        setSelectedNews(news);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedNews(null);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentNewsList = newsList.slice(indexOfFirstItem, indexOfLastItem);

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

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        adaptiveHeight: true,
    };

    return (
        <>
            <Helmet>
                <title>Quản lý tin tức</title>
            </Helmet>
            <HeaderAdmin />
            <Container maxWidth="lg" sx={{ mt: 10 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                    <Typography variant="h4" sx={{ fontWeight: "bold" }}>📰 Danh sách tin tức</Typography>
                    <Button
                        variant="contained"
                        sx={{ backgroundColor: "#FFC107", color: "black", '&:hover': { backgroundColor: "#FFA000" } }}
                        startIcon={<AddIcon />}
                        onClick={() => navigate("/news/create")}
                    >
                        Thêm bài mới
                    </Button>
                </Box>
                <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: "hidden" }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Hình ảnh</TableCell>
                                <TableCell>Tiêu đề</TableCell>
                                <TableCell>Ngày đăng</TableCell>
                                <TableCell align="center">Hành động</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {currentNewsList.map((news) => (
                                <TableRow key={news.id}>
                                    <TableCell align="center">
                                        {news.images?.length > 0 ? (
                                            <CardMedia
                                                component="img"
                                                image={news.images[0].img}
                                                alt={news.title}
                                                sx={{ width: 80, height: 80, objectFit: "cover", borderRadius: 1 }}
                                            />
                                        ) : (
                                            "Không có ảnh"
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="h6" sx={{ cursor: "pointer" }} onClick={() => handleOpenModal(news)}>
                                            {news.title || "Không có tiêu đề"}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>{new Date(news.dateNews).toLocaleString()}</TableCell>
                                    <TableCell align="center">
                                        <IconButton color="primary" onClick={() => navigate(`/news/edit/${news.id}`)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton color="error" onClick={() => handleDelete(news.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Pagination count={Math.ceil(newsList.length / itemsPerPage)} page={currentPage} onChange={(e, value) => setCurrentPage(value)} />

                <Modal open={openModal} onClose={handleCloseModal}>
                    <Box sx={{ p: 3, backgroundColor: "white", borderRadius: 2, maxWidth: 600, mx: "auto", mt: 10 }}>
                        {selectedNews && (
                            <>
                                <Typography variant="h5">{selectedNews.title}</Typography>
                                {selectedNews.images?.length > 0 && (
                                    <Slider {...sliderSettings}>
                                        {selectedNews.images.map((image, index) => (
                                            <Box key={index} sx={{ display: "flex", justifyContent: "center" }}>
                                                <CardMedia
                                                    component="img"
                                                    image={image.img}
                                                    alt={selectedNews.title}
                                                    sx={{
                                                        width: "100%",
                                                        height: 300,
                                                        objectFit: "cover",
                                                        borderRadius: 2,
                                                    }}
                                                />
                                            </Box>
                                        ))}
                                    </Slider>
                                )}
                                <Box sx={{ maxHeight: 300, overflow: "auto", mt: 2 }}>
                                    <Typography>{selectedNews.content}</Typography>
                                </Box>
                            </>
                        )}
                    </Box>
                </Modal>
            </Container>
        </>
    );
};

export default NewsListComponent;
