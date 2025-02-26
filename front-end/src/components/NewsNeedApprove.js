import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPendingNews, updateNewsStatus } from "../service/NewService";
import { Container, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogTitle, Box } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import { Helmet } from "react-helmet-async";
import HeaderAdmin from "../component/admin/HeaderAdmin";

const PendingNewsList = () => {
    const [newsList, setNewsList] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [newsToUpdate, setNewsToUpdate] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const role = localStorage.getItem("role");
        if (role !== "admin") {
            navigate("/login");
            return;
        }
        fetchPendingNews();
    }, [navigate]);

    const fetchPendingNews = async () => {
        try {
            const response = await getPendingNews(); // Lấy danh sách bài viết chờ duyệt
            setNewsList(response);
        } catch (error) {
            toast.error("❌ Lỗi khi tải danh sách tin tức chờ duyệt!");
        }
    };

    // Hàm duyệt bài viết
    const handleApprove = async (id) => {
        try {
            await updateNewsStatus(id, 'APPROVED');
            toast.success("✅ Bài viết đã được duyệt!");
            setNewsList(prev => prev.filter(news => news.id !== id));
        } catch (error) {
            console.error("Lỗi duyệt bài:", error);
        }
    };

    // Mở dialog xác nhận từ chối bài viết
    const handleReject = (news) => {
        setNewsToUpdate(news);
        setOpenDialog(true);
    };

    // Xác nhận từ chối bài viết
    const confirmReject = async () => {
        if (newsToUpdate) {
            try {
                await updateNewsStatus(newsToUpdate.id, 'REJECTED');
                toast.success("✅ Bài viết đã bị từ chối!");
                setNewsList(prev => prev.filter(news => news.id !== newsToUpdate.id));
            } catch (error) {
                toast.error("❌ Lỗi khi từ chối bài viết!");
            }
        }
        setOpenDialog(false);
    };

    return (
        <>
            <Helmet>
                <title>Tin Tức Chờ Duyệt</title>
            </Helmet>
            <HeaderAdmin />
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
                    Danh Sách Bài Viết Chờ Duyệt
                </Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Tiêu đề</TableCell>
                                <TableCell>Hình ảnh</TableCell>
                                <TableCell>Người đăng</TableCell>
                                <TableCell>Ngày đăng</TableCell>
                                <TableCell align="center">Hành động</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {newsList.length > 0 ? newsList.map((news) => (
                                <TableRow key={news.id}>
                                    <TableCell>{news.title}</TableCell>
                                    <TableCell>
                                        {news.images && news.images.length > 0 ? (
                                            <img
                                                src={news.images[0].img}
                                                alt="Thumbnail"
                                                style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 4 }}
                                            />
                                        ) : (
                                            "No Image"
                                        )}
                                    </TableCell>
                                    <TableCell>{news.createdBy}</TableCell>
                                    <TableCell>{new Date(news.dateNews).toLocaleString()}</TableCell>
                                    <TableCell align="center">
                                        <Box display="flex" gap={1} justifyContent="center">
                                            <Button
                                                variant="contained"
                                                color="success"
                                                onClick={() => handleApprove(news.id)}
                                            >
                                                Duyệt
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                onClick={() => handleReject(news)}
                                            >
                                                Từ chối
                                            </Button>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">Không có bài viết nào đang chờ duyệt</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                {/* Dialog xác nhận từ chối */}
                <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                    <DialogTitle>Xác nhận từ chối</DialogTitle>
                    <DialogContent>
                        <Typography>Bạn có chắc chắn muốn từ chối bài viết "{newsToUpdate?.title}" không?</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
                        <Button onClick={confirmReject} color="error" variant="contained">Từ chối</Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </>
    );
};

export default PendingNewsList;
