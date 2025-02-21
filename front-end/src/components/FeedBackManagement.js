import React, { useEffect, useState } from "react";
import { getFeedback, searchFeedbackByDate } from "../service/FeedBackService";
import {
    Box,
    CircularProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    IconButton,
    TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FeedbackDetailModal from "./FeedbackDetailModal";
import dayjs from 'dayjs';

const FeedBackManagement = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [searchDate, setSearchDate] = useState("");

    const loadFeedbacks = async () => {
        try {
            setLoading(true);
            const data = await getFeedback();
            setFeedbacks(data);
        } catch (err) {
            console.error("Error fetching feedback:", err);
            setError("Không thể lấy danh sách feedback.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadFeedbacks();
    }, []);

    const handleDetail = (feedback) => {
        setSelectedFeedback(feedback);
        setOpenModal(true);
    };

    const handleClose = () => {
        setOpenModal(false);
        setSelectedFeedback(null);
    };

    const handleSearch = async () => {
        if (!searchDate) return;
        try {
            setLoading(true);
            const data = await searchFeedbackByDate(searchDate);
            setFeedbacks(data);
        } catch (err) {
            console.error("Error searching feedback by date:", err);
            setError("Không thể tìm kiếm feedback theo ngày.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Typography variant="h6" color="error" align="center" mt={4}>
                {error}
            </Typography>
        );
    }

    return (
        <Box mx={2} my={4}>
            <Typography variant="h4" align="center" gutterBottom>
                Danh sách Feedbacks
            </Typography>

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    mb: 2,
                }}
            >
                <TextField
                    label="Ngày"
                    type="date"
                    value={searchDate}
                    onChange={(e) => setSearchDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                />
                <IconButton
                    onClick={handleSearch}
                    color="primary"
                    aria-label="Tìm kiếm"
                    sx={{
                        backgroundColor: "#E7B45A",
                        "&:hover": { backgroundColor: "#dba147" },
                        ml: 1,
                        p: 0.5,
                    }}
                >
                    <SearchIcon fontSize="small" sx={{ color: "#fff" }} />
                </IconButton>
            </Box>

            <TableContainer component={Paper} elevation={3} sx={{ maxWidth: "100%", margin: "auto" }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" sx={{ fontWeight: "bold" }}>
                                STT
                            </TableCell>
                            <TableCell align="center" sx={{ fontWeight: "bold" }}>
                                Mã Feedback
                            </TableCell>
                            <TableCell align="center" sx={{ fontWeight: "bold" }}>
                                Ngày Feedback
                            </TableCell>
                            <TableCell align="center" sx={{ fontWeight: "bold" }}>
                                Khách hàng
                            </TableCell>
                            <TableCell align="center" sx={{ fontWeight: "bold" }}>
                                Số Điện Thoại
                            </TableCell>
                            <TableCell align="center" sx={{ fontWeight: "bold" }}>
                                Chi tiết
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {feedbacks.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    Không có feedback trong bảng này
                                </TableCell>
                            </TableRow>
                        ) : (
                            feedbacks.map((feedback, index) => (
                                <TableRow
                                    key={feedback.id}
                                    sx={{
                                        backgroundColor: index % 2 === 0 ? "action.hover" : "background.paper",
                                    }}
                                >
                                    <TableCell align="center">{index + 1}</TableCell>
                                    <TableCell align="center">{feedback.codeFeedback}</TableCell>
                                    <TableCell align="center">
                                        {dayjs(feedback.dateFeedback).format('DD/MM/YYYY HH:mm')}
                                    </TableCell>
                                    <TableCell align="center">
                                        {feedback.customer
                                            ? feedback.customer.nameCustomer || feedback.customer.id
                                            : "N/A"}
                                    </TableCell>
                                    <TableCell align="center">
                                        {feedback.customer && feedback.customer.phoneCustomer
                                            ? feedback.customer.phoneCustomer
                                            : "N/A"}
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton onClick={() => handleDetail(feedback)} color="primary">
                                            <VisibilityIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <FeedbackDetailModal open={openModal} feedback={selectedFeedback} onClose={handleClose} />
        </Box>
    );
};

export default FeedBackManagement;
