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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { Helmet } from "react-helmet-async";
import HeaderAdmin from "../component/admin/HeaderAdmin";

const NewsListComponent = () => {
    const [newsList, setNewsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
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
                newsData = newsData.sort((a, b) => new Date(b.dateNews) - new Date(a.dateNews));
                setNewsList(newsData);
            } else {
                throw new Error("Dữ liệu không đúng định dạng.");
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
                                        <Typography variant="h6" sx={{ cursor: "pointer" }}>
                                            {news.title || "Không có tiêu đề"}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>{new Date(news.dateNews).toLocaleString()}</TableCell>
                                    <TableCell align="center">
                                        <IconButton color="primary" onClick={() => navigate(`/news/edit/${news.id}`)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton color="error" onClick={() => handleOpenDeleteDialog(news)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                    <Pagination count={Math.ceil(newsList.length / itemsPerPage)} page={currentPage} onChange={(e, value) => setCurrentPage(value)} />
                </Box>

                <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
                    <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1, color: "#f57c00", fontWeight: "bold" }}>
                        <WarningAmberIcon fontSize="large" /> Xác nhận xóa
                    </DialogTitle>
                    <DialogContent>
                        <Typography textAlign="center" variant="body1">
                            Bạn có chắc chắn muốn xóa bài tin <b>{newsToDelete?.title}</b> không?
                        </Typography>
                    </DialogContent>
                    <DialogActions sx={{ justifyContent: "flex-end", gap: 2, px: 3, pb: 2 }}>
                        <Button
                            onClick={handleCloseDeleteDialog}
                            sx={{ backgroundColor: "#b0bec5", color: "black", '&:hover': { backgroundColor: "#90a4ae" } }}
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
