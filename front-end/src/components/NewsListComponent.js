import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {getAllNews, deleteNews, getPendingNews} from "../service/NewService";
import { connectWebSocketUser, disconnectWebSocket } from "../service/WebSocketService";
import {
    Container,
    Typography,
    CardMedia,
    Button,
    Box,
    Paper,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Pagination,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Modal
} from "@mui/material";
import Badge from '@mui/material/Badge';
import { Helmet } from "react-helmet-async";
import HeaderAdmin from "../component/admin/HeaderAdmin";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { toast} from "react-toastify";
import EmployeeDashboard from "./EmployeeDashboard";

const NewsListComponent = () => {
    const [newsList, setNewsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;
    const [openModal, setOpenModal] = useState(false);
    const [selectedNews, setSelectedNews] = useState(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [newsToDelete, setNewsToDelete] = useState(null);
    const navigate = useNavigate();
    const role = localStorage.getItem("role");
    const hasPendingNews = newsList.some(news => news.status === "PENDING");
    const [pendingNewsCount, setPendingNewsCount] = useState(0);

    useEffect(() => {
        const role = localStorage.getItem("role");

        if (role !== "admin" && role !== "employ") {
            navigate("/login");
            return;
        }
        fetchNews();
        connectWebSocketUser(fetchNews);

        return () => {
            disconnectWebSocket();
        };
    }, []);

    useEffect(() => {
        const fetchPendingNewsCount = async () => {
            try {
                const response = await getPendingNews();
                setPendingNewsCount(response.length);
            } catch (error) {
                console.error("Lỗi khi tải số lượng bài viết chờ duyệt:", error);
            }
        };

        fetchPendingNewsCount();
    }, [newsList]);


    const fetchNews = async () => {
        try {
            setLoading(true);
            const response = await getAllNews();
            let newsData = response.data || response;
            const role = localStorage.getItem("role");
            const username = localStorage.getItem("username"); // Lấy username từ localStorage

            if (Array.isArray(newsData)) {
                if (role === "employ") {
                    newsData = newsData.filter(news => news.createdBy === username);
                }

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
    const getStatusLabel = (status) => {
        switch (status) {
            case "PENDING":
                return "Đang chờ xét duyệt";
            case "APPROVED":
                return "Đã duyệt";
            case "REJECTED":
                return "Bị từ chối";
            default:
                return "Không xác định";
        }
    };
    const handleDelete = async (id) => {
        try {
            await deleteNews(id);
            setNewsList((prev) => prev.filter((news) => news.id !== id));
            toast.success("Xóa tin tức thành công!");
        } catch (err) {
            toast.error("Xóa bài tin thất bại.");
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

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        adaptiveHeight: true,
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <Typography variant="h6">Đang tải...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Typography variant="body1" color="error">{error}</Typography>
            </Container>
        );
    }

    return (
        <>
            {role === "admin" ? <HeaderAdmin /> : <EmployeeDashboard />}
            <Helmet>
                <title>Quản lý tin tức</title>
            </Helmet>
            <Container
                maxWidth="lg"
                sx={{
                    mt: role === "employ" ? 0 : 4,
                    pt: role === "employ" ? 0 : 4,
                }}
            >
                <Grid
                    container
                    alignItems="center"
                    justifyContent="center"
                    sx={{ position: 'relative', my: 2 }} // my: 2 sẽ áp dụng margin-top và margin-bottom
                >
                    <Grid item>
                        {role === "employ" ? (
                            <Typography variant="h4" align="center" gutterBottom>
                                Danh sách Tin Tức
                            </Typography>
                        ) : (
                            <Typography
                                variant="h5"
                                sx={{ fontWeight: 'bold', color: 'black', textAlign: 'center' }}
                            >
                                Danh Sách Tin Tức
                            </Typography>
                        )}
                    </Grid>
                </Grid>
                <Grid container alignItems="center" justifyContent="flex-end" sx={{ my: 2 }}>
                    {role === "admin" && (
                        <Grid item>
                            <Badge badgeContent={pendingNewsCount} color="error" sx={{ mr: 2 }}>
                                <Button
                                    variant="contained"
                                    color="warning"
                                    onClick={() => navigate("/pending-news")}
                                    sx={{ textTransform: "none" }}
                                >
                                    Bài Viết Chờ Duyệt
                                </Button>
                            </Badge>
                        </Grid>
                    )}
                    <Grid item>
                        <Button
                            variant="contained"
                            onClick={() => navigate("/news/create")}
                            sx={{
                                backgroundColor: "#E7B45A",
                                color: "black",
                                "&:hover": { backgroundColor: "#D1A750" },
                            }}
                        >
                            Thêm bài mới
                        </Button>
                    </Grid>
                </Grid>
                <TableContainer component={Paper} sx={{ maxHeight: "600px", overflowY: "auto", mb: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Hình ảnh</TableCell>
                                <TableCell>Tiêu đề</TableCell>
                                <TableCell>Ngày đăng</TableCell>
                                {role === "employ" && hasPendingNews && <TableCell>Trạng thái</TableCell>}
                                <TableCell align="center">{role === "admin" || (role === "employ" && hasPendingNews) ? "Hành động" : null}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {currentNewsList.length > 0 ? currentNewsList.map((news) => (
                                <TableRow key={news.id}>
                                    <TableCell align="center">
                                        {news.images?.length > 0 ? (
                                            <CardMedia
                                                component="img"
                                                image={news.images[0].img}
                                                alt={news.title}
                                                sx={{
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
                                            onClick={() => handleOpenModal(news)}
                                            sx={{
                                                cursor: "pointer",
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                maxWidth: "200px",
                                            }}
                                        >
                                            {news.title || "Không có tiêu đề"}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        {new Date(news.dateNews).toLocaleDateString()}<br />
                                        {new Date(news.dateNews).toLocaleTimeString()}
                                    </TableCell>
                                    {role === "employ" && (
                                        <TableCell>
                                            <Typography
                                                sx={{
                                                    fontWeight: "bold",
                                                    color: news.status === "PENDING" ? "#f57c00" : news.status === "APPROVED" ? "#2e7d32" : "#d32f2f",
                                                }}
                                            >
                                                {getStatusLabel(news.status)}
                                            </Typography>
                                        </TableCell>
                                    )}
                                    <TableCell align="center">
                                        {(role === "admin" || (role === "employ" && news.status === "PENDING")) && (
                                            <Box display="flex" justifyContent="center" gap={1}>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    size="small"
                                                    onClick={() => navigate(`/news/edit/${news.id}`)}
                                                    sx={{ fontSize: '0.875rem' }}
                                                >
                                                    Sửa
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    size="small"
                                                    onClick={() => handleOpenDeleteDialog(news)}
                                                    sx={{ fontSize: '0.875rem' }}
                                                >
                                                    Xóa
                                                </Button>
                                            </Box>
                                        )}
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        <Typography variant="body1" sx={{ color: "#C4975C" }}>
                                            Không có tin tức nào
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box display="flex" justifyContent="center" mb={3}>
                    <Pagination
                        count={Math.ceil(newsList.length / itemsPerPage)}
                        page={currentPage}
                        onChange={(e, value) => setCurrentPage(value)}
                        color="primary"
                        size="medium"
                    />
                </Box>

                {/* Modal Xem Chi Tiết Tin */}
                <Modal open={openModal} onClose={handleCloseModal}>
                    <Box
                        sx={{
                            p: 3,
                            bgcolor: "white",
                            borderRadius: 3,
                            maxWidth: 500, // Chiều rộng modal
                            minHeight: 400,
                            mx: "auto",
                            mt: 2,
                            outline: "none",
                            boxShadow: 5,
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        {selectedNews && (
                            <>
                                {/* Tiêu đề tin tức */}
                                <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", textAlign: "center" }}>
                                    {selectedNews.title}
                                </Typography>

                                {/* Slider ảnh */}
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
                                                        height: 250, // Giảm chiều cao ảnh
                                                        objectFit: "cover",
                                                        borderRadius: 2,
                                                    }}
                                                />
                                            </Box>
                                        ))}
                                    </Slider>
                                )}

                                {/* Nội dung tin tức */}
                                <Box
                                    sx={{
                                        flex: 1,
                                        overflowY: "auto",
                                        mt: 2,
                                        whiteSpace: "pre-line",
                                        maxHeight: 250, // Giới hạn chiều cao nội dung
                                    }}
                                >
                                    <Typography variant="body2">{selectedNews.content}</Typography>
                                </Box>

                                {/* Nút đóng */}
                                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                                    <Button variant="contained" onClick={handleCloseModal}>
                                        Đóng
                                    </Button>
                                </Box>
                            </>
                        )}
                    </Box>
                </Modal>

                {/* Dialog Xác Nhận Xóa */}
                <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
                    <DialogTitle sx={{ fontWeight: "bold", color: "#f57c00" }}>
                        Xác nhận xóa
                    </DialogTitle>
                    <DialogContent>
                        <Typography>
                            Bạn có chắc chắn muốn xóa bài tin <strong>{newsToDelete?.title}</strong> không?
                        </Typography>
                    </DialogContent>
                    <DialogActions sx={{ justifyContent: "flex-end", gap: 2, px: 3, pb: 2 }}>
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
                        <Button onClick={handleDeleteConfirm} color="error" variant="contained">
                            Xóa
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </>
    );
};

export default NewsListComponent;
