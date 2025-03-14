import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPendingNews, updateNewsStatus } from "../service/NewService";
import {
    Container,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Box,
    Modal,
    CardMedia
} from "@mui/material";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";
import HeaderAdmin from "../component/admin/HeaderAdmin";
// Nếu bạn muốn sử dụng slider thì import thêm thư viện slider (vd: react-slick)
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

const PendingNewsList = () => {
    const [newsList, setNewsList] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [newsToUpdate, setNewsToUpdate] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [selectedNews, setSelectedNews] = useState(null);
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
            await updateNewsStatus(id, "APPROVED");
            toast.success("✅ Bài viết đã được duyệt!");
            setNewsList((prev) => prev.filter((news) => news.id !== id));
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
                await updateNewsStatus(newsToUpdate.id, "REJECTED");
                toast.success("✅ Bài viết đã bị từ chối!");
                setNewsList((prev) => prev.filter((news) => news.id !== newsToUpdate.id));
            } catch (error) {
                toast.error("❌ Lỗi khi từ chối bài viết!");
            }
        }
        setOpenDialog(false);
    };

    // Mở modal xem chi tiết bài viết
    const handleOpenModal = (news) => {
        setSelectedNews(news);
        setOpenModal(true);
    };

    // Đóng modal
    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedNews(null);
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
                            {newsList.length > 0 ? (
                                newsList.map((news) => (
                                    <TableRow key={news.id}>
                                        <TableCell>
                                            <Typography
                                                sx={{
                                                    cursor: "pointer",
                                                    color: "blue",
                                                    textDecoration: "underline",
                                                }}
                                                onClick={() => handleOpenModal(news)}
                                            >
                                                {news.title}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            {news.images && news.images.length > 0 ? (
                                                <img
                                                    src={news.images[0].img}
                                                    alt="Thumbnail"
                                                    style={{
                                                        width: 80,
                                                        height: 80,
                                                        objectFit: "cover",
                                                        borderRadius: 4,
                                                    }}
                                                />
                                            ) : (
                                                "Không có hình ảnh"
                                            )}
                                        </TableCell>
                                        <TableCell>{news.createdBy}</TableCell>
                                        <TableCell>
                                            {new Date(news.dateNews).toLocaleString()}
                                        </TableCell>
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
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        Không có bài viết nào đang chờ duyệt
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Dialog xác nhận từ chối */}
                <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                    <DialogTitle>Xác nhận từ chối</DialogTitle>
                    <DialogContent>
                        <Typography>
                            Bạn có chắc chắn muốn từ chối bài viết "{newsToUpdate?.title}" không?
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
                        <Button onClick={confirmReject} color="error" variant="contained">
                            Từ chối
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Modal xem chi tiết bài viết */}
                <Modal open={openModal} onClose={handleCloseModal}>
                    <Box
                        sx={{
                            p: 3,
                            bgcolor: "white",
                            borderRadius: 3,
                            maxWidth: 500,
                            minHeight: 400,
                            mx: "auto",
                            my: "10%",
                            outline: "none",
                            boxShadow: 5,
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        {selectedNews && (
                            <>
                                <Typography
                                    variant="h6"
                                    sx={{ mb: 2, fontWeight: "bold", textAlign: "center" }}
                                >
                                    {selectedNews.title}
                                </Typography>

                                {/* Nếu có nhiều ảnh, bạn có thể thêm slider ở đây */}
                                {selectedNews.images && selectedNews.images.length > 0 ? (
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            mb: 2,
                                        }}
                                    >
                                        <CardMedia
                                            component="img"
                                            image={selectedNews.images[0].img}
                                            alt={selectedNews.title}
                                            sx={{
                                                width: "100%",
                                                height: 250,
                                                objectFit: "cover",
                                                borderRadius: 2,
                                            }}
                                        />
                                    </Box>
                                ) : (
                                    <Typography align="center">Không có hình ảnh</Typography>
                                )}

                                {/* Nội dung bài viết */}
                                <Box
                                    sx={{
                                        flex: 1,
                                        overflowY: "auto",
                                        mt: 2,
                                        whiteSpace: "pre-line",
                                    }}
                                >
                                    <Typography variant="body2">
                                        {selectedNews.content}
                                    </Typography>
                                </Box>

                                <Box
                                    sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}
                                >
                                    <Button variant="contained" onClick={handleCloseModal}>
                                        Đóng
                                    </Button>
                                </Box>
                            </>
                        )}
                    </Box>
                </Modal>
            </Container>
        </>
    );
};

export default PendingNewsList;
