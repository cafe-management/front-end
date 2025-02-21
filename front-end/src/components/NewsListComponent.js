import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllNews, deleteNews } from "../service/NewService";
import { connectWebSocketUser, disconnectWebSocket } from "../service/WebSocketService";
import {
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
    Modal,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
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
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [newsToDelete, setNewsToDelete] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchNews();
        connectWebSocketUser(fetchNews);

        return () => {
            disconnectWebSocket();
        };
    }, []);

    const fetchNews = async () => {
        try {
            setLoading(true);
            const response = await getAllNews();
            let newsData = response.data || response;
            if (Array.isArray(newsData)) {
                newsData = newsData.sort(
                    (a, b) => new Date(b.dateNews) - new Date(a.dateNews)
                );
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

    const handleOpenDeleteDialog = (news) => {
        setNewsToDelete(news);
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setNewsToDelete(null);
    };

    const handleDeleteConfirm = async () => {
        if (newsToDelete) {
            await handleDelete(newsToDelete.id);
        }
        handleCloseDeleteDialog();
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
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 3,
                    }}
                >
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: "bold",
                            flexGrow: 1,
                            textAlign: "center",
                        }}
                    >
                        Danh sách tin tức
                    </Typography>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: "#FFC107",
                            color: "black",
                            "&:hover": { backgroundColor: "#FFA000" },
                        }}
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
                                                sx={{
                                                    width: 80,
                                                    height: 80,
                                                    objectFit: "cover",
                                                    borderRadius: 1,
                                                }}
                                            />
                                        ) : (
                                            "Không có ảnh"
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Typography
                                            variant="h6"
                                            sx={{ cursor: "pointer" }}
                                            onClick={() => handleOpenModal(news)}
                                        >
                                            {news.title || "Không có tiêu đề"}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        {new Date(news.dateNews).toLocaleString("vi-VN", { hour12: false })}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Box display="flex" justifyContent="center" gap={1}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                size="small"
                                                onClick={() => navigate(`/news/edit/${news.id}`)}
                                                sx={{ fontSize: '0.875rem' }}  // Giảm kích thước font nếu cần
                                            >
                                               sửa
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                size="small"  // Giảm kích thước nút
                                                onClick={() => handleOpenDeleteDialog(news)}
                                                sx={{ fontSize: '0.875rem' }}  // Giảm kích thước font nếu cần
                                            >
                                                Xóa
                                            </Button>
                                        </Box>
                                    </TableCell>



                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                    <Pagination
                        count={Math.ceil(newsList.length / itemsPerPage)}
                        page={currentPage}
                        onChange={(e, value) => setCurrentPage(value)}
                    />
                </Box>

                {/* Modal xem chi tiết tin */}
                <Modal open={openModal} onClose={handleCloseModal}>
                    <Box
                        sx={{
                            p: 3,
                            backgroundColor: "white",
                            borderRadius: 2,
                            maxWidth: 600,
                            mx: "auto",
                            mt: 10,
                            outline: "none",
                        }}
                    >
                        {selectedNews && (
                            <>
                                <Typography variant="h5" sx={{ mb: 2 }}>
                                    {selectedNews.title}
                                </Typography>
                                {selectedNews.images?.length > 0 && (
                                    <Slider {...sliderSettings}>
                                        {selectedNews.images.map((image, index) => (
                                            <Box
                                                key={index}
                                                sx={{ display: "flex", justifyContent: "center" }}
                                            >
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
                                <Box
                                    sx={{
                                        maxHeight: 300,
                                        overflow: "auto",
                                        mt: 2,
                                        whiteSpace: "pre-line",
                                    }}
                                >
                                    <Typography>{selectedNews.content}</Typography>
                                </Box>
                                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                                    <Button variant="contained" onClick={handleCloseModal}>
                                        Đóng
                                    </Button>
                                </Box>
                            </>
                        )}
                    </Box>
                </Modal>

                {/* Dialog xác nhận xóa */}
                <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
                    <DialogTitle sx={{ fontWeight: "bold", color: "#f57c00" }}>
                        Xác nhận xóa
                    </DialogTitle>
                    <DialogContent>
                        <Typography>
                            Bạn có chắc chắn muốn xóa bài tin{" "}
                            <strong>{newsToDelete?.title}</strong> không?
                        </Typography>
                    </DialogContent>
                    <DialogActions
                        sx={{
                            justifyContent: "flex-end",
                            gap: 2,
                            px: 3,
                            pb: 2,
                        }}
                    >
                        <Button
                            onClick={handleCloseDeleteDialog}
                            sx={{
                                backgroundColor: "#b0bec5",
                                color: "black",
                                "&:hover": { backgroundColor: "#90a4ae" },
                            }}
                        >
                            Hủy
                        </Button>
                        <Button
                            onClick={handleDeleteConfirm}
                            color="error"
                            variant="contained"
                        >
                            Xóa
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </>
    );
};

export default NewsListComponent;
