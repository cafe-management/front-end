import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {getAllNews, deleteNews, approveNews, getPendingNews, rejectNews} from "../service/NewService";
import { Container, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogTitle, Box } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import {Helmet} from "react-helmet-async";
import HeaderAdmin from "../component/admin/HeaderAdmin";

const PendingNewsList = () => {
    const [newsList, setNewsList] = useState([]);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [newsToDelete, setNewsToDelete] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const role = localStorage.getItem("role");
        if (role !== "admin") {
            navigate("/login");
            return;
        }
        fetchPendingNews();
    }, []);

    const fetchPendingNews = async () => {
        try {
            const response = await getPendingNews(); // Gọi API lấy danh sách bài chờ duyệt
            setNewsList(response); // Cập nhật danh sách tin tức
        } catch (error) {
            toast.error("❌ Lỗi khi tải danh sách tin tức chờ duyệt!");
        }
    };

    const handleApprove = async (id) => {
        const role = localStorage.getItem("role");
        console.log("Role hiện tại:", role);
        if (role !== "admin") {
            toast.error("⛔ Bạn không có quyền duyệt bài viết!");
            return;
        }
        try {
            await approveNews(id);
            toast.success("✅ Bài viết đã được duyệt!");
            setNewsList(prev => prev.filter(news => news.id !== id));
        } catch (error) {
            console.error("Lỗi duyệt bài:", error);
        }
    };

    const handleReject = (news) => {
        setNewsToDelete(news);
        setOpenDeleteDialog(true);
    };

    const confirmReject = async () => {
        if (newsToDelete) {
            try {
                // Cập nhật trạng thái của bài viết thành 'REJECTED' thay vì xóa
                await updateNewsStatus(newsToDelete.id, 'REJECTED');
                // Cập nhật lại danh sách bài viết
                setNewsList(prev => prev.filter(news => news.id !== newsToDelete.id));
                toast.success("Đã từ chối duyệt bài viết này");
            } catch (error) {
                toast.error("❌ Lỗi khi từ chối bài viết!");
            }
        }
        setOpenDeleteDialog(false);
    };
    const updateNewsStatus = async (id, status) => {
        try {
            // Gọi API để cập nhật trạng thái bài viết
            await rejectNews(newsToDelete.id);
        } catch (error) {
            console.error("Lỗi cập nhật trạng thái bài viết:", error);
            throw error;
        }
    };
    return (
        <>
            <Helmet>
                <title>Tin Tức Chờ Duyệt</title>
            </Helmet>
            <HeaderAdmin/>
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <ToastContainer position="top-right" autoClose={3000} />
                <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
                    Danh Sách Bài Viết Chờ Duyệt
                </Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Tiêu đề</TableCell>
                                <TableCell>Người đăng</TableCell>
                                <TableCell>Ngày đăng</TableCell>
                                <TableCell align="center">Hành động</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {newsList.length > 0 ? newsList.map((news) => (
                                <TableRow key={news.id}>
                                    <TableCell>{news.title}</TableCell>
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
                                    <TableCell colSpan={4} align="center">Không có bài viết nào đang chờ duyệt</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                {/* Dialog Xác nhận từ chối */}
                <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                    <DialogTitle>Xác nhận từ chối</DialogTitle>
                    <DialogContent>
                        <Typography>Bạn có chắc chắn muốn từ chối bài viết "{newsToDelete?.title}" không?</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDeleteDialog(false)}>Hủy</Button>
                        <Button onClick={confirmReject} color="error" variant="contained">Từ chối</Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </>

    );
};

export default PendingNewsList;
