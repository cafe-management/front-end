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
    Snackbar,
    Pagination,
    CardMedia,
    Grid
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";

const NewsListComponent = () => {
    const [newsList, setNewsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [notification, setNotification] = useState({ open: false, message: "" });

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedNews, setSelectedNews] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const navigate = useNavigate();

    const fetchNews = async () => {
        try {
            const response = await getAllNews();
            let newsData = response.data ? response.data : response;

            if (Array.isArray(newsData)) {
                newsData = newsData.sort((a, b) => new Date(b.dateNews) - new Date(a.dateNews));
                setNewsList(newsData);
            } else {
                setError("Dữ liệu trả về không đúng định dạng.");
            }
        } catch (err) {
            setError("Có lỗi xảy ra khi tải tin tức.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
        connectWebSocketUser(() => {
            setNotification({ open: true, message: "🆕 Tin tức mới đã được cập nhật!" });
            fetchNews();
        });

        return () => {
            disconnectWebSocket();
        };
    }, []);

    const handleShowDeleteModal = (news) => {
        setSelectedNews(news);
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setSelectedNews(null);
    };

    const handleDeleteConfirm = async () => {
        if (selectedNews) {
            try {
                await deleteNews(selectedNews.id);
                setNewsList((prevNews) => prevNews.filter((news) => news.id !== selectedNews.id));
            } catch (err) {
                alert("Xóa bài tin thất bại.");
            }
        }
        handleCloseDeleteModal();
    };

    const handleShowDetailModal = (news) => {
        setSelectedNews(news);
        setShowDetailModal(true);
    };

    const handleCloseDetailModal = () => {
        setShowDetailModal(false);
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

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                    📰 Danh sách tin tức
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    sx={{ backgroundColor: "#1976D2", "&:hover": { backgroundColor: "#1565C0" } }}
                    onClick={() => navigate("/news/create")}
                >
                    Thêm bài mới
                </Button>
            </Box>

            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
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
                            <TableRow key={news.id} sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}>
                                <TableCell align="center">
                                    {news.images?.length > 0 ? (
                                        <img src={news.images[0].img} alt={news.title} style={{ width: 80, height: 80, borderRadius: 8 }} />
                                    ) : (
                                        <Typography color="textSecondary">Không có ảnh</Typography>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            textDecoration: "none",
                                            color: "black",
                                            fontWeight: "bold",
                                            "&:hover": { color: "#1976D2", cursor: "pointer" }
                                        }}
                                        onClick={() => handleShowDetailModal(news)}
                                    >
                                        {news.title || "Không có tiêu đề"}
                                    </Typography>
                                </TableCell>

                                <TableCell>{new Date(news.dateNews).toLocaleString()}</TableCell>
                                <TableCell align="center">
                                    <IconButton color="primary" onClick={() => navigate(`/news/edit/${news.id}`)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton color="error" onClick={() => handleShowDeleteModal(news)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                <Pagination count={Math.ceil(newsList.length / itemsPerPage)} page={currentPage} onChange={(event, value) => setCurrentPage(value)} color="primary" />
            </Box>

            <Snackbar open={notification.open} autoHideDuration={4000} onClose={() => setNotification({ open: false, message: "" })} message={notification.message} />

            {/* Detail Modal */}
            <Modal open={showDetailModal} onClose={handleCloseDetailModal}>
                <Box sx={{ p: 4, bgcolor: "background.paper", borderRadius: 2, width: "50%", margin: "auto", mt: 10, maxHeight: "80vh", overflowY: "auto" }}>
                    <Typography variant="h5">{selectedNews?.title}</Typography>
                    <Typography variant="caption" color="textSecondary">🕒 {new Date(selectedNews?.dateNews).toLocaleString()}</Typography>
                    <Grid container spacing={2} sx={{ mt: 2, overflowX: "auto" }}>
                        {selectedNews?.images?.map((img, index) => (
                            <Grid item xs={4} key={index}>
                                <CardMedia component="img" height="150" image={img.img} alt="News Image" sx={{ borderRadius: 2, objectFit: "contain" }} />
                            </Grid>
                        ))}
                    </Grid>
                    <Typography variant="body1" sx={{ mt: 2 }}>{selectedNews?.content}</Typography>
                    <Button onClick={handleCloseDetailModal} sx={{ mt: 2 }} startIcon={<CloseIcon />}>Đóng</Button>
                </Box>
            </Modal>

            <Modal open={showDeleteModal} onClose={handleCloseDeleteModal}>
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', p: 4, borderRadius: 2 }}>
                    <Typography variant="h6">⚠️ Xác nhận xóa</Typography>
                    <Typography sx={{ mt: 2 }}>Bạn có chắc chắn muốn xóa bài tin "{selectedNews?.title}" không?</Typography>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
                        <Button variant="contained" color="secondary" onClick={handleCloseDeleteModal}>Hủy</Button>
                        <Button variant="contained" color="error" sx={{ ml: 2 }} onClick={handleDeleteConfirm}>Xóa</Button>
                    </Box>
                </Box>
            </Modal>

        </Container>
    );
};

export default NewsListComponent;
