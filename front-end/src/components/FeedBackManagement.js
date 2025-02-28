import React, { useState, useEffect } from "react";
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
    Pagination,
    Rating,
    Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FeedbackDetailModal from "./FeedbackDetailModal";
import dayjs from "dayjs";

const FeedBackManagement = () => {
    const [allFeedbacks, setAllFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [searchDate, setSearchDate] = useState("");
    const [ratingFilter, setRatingFilter] = useState(0);
    const [page, setPage] = useState(1);
    const pageSize = 5;

    const loadFeedbacks = async () => {
        try {
            setLoading(true);
            const data = await getFeedback();
            setAllFeedbacks(data.content);
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

    useEffect(() => {
        setPage(1);
    }, [ratingFilter]);

    // Lọc feedback theo rating nếu có chọn
    const filteredFeedbacks =
        ratingFilter > 0
            ? allFeedbacks.filter((fb) => Number(fb.rating) === ratingFilter)
            : allFeedbacks;

    const totalPages = Math.ceil(filteredFeedbacks.length / pageSize);
    const indexOfLast = page * pageSize;
    const indexOfFirst = indexOfLast - pageSize;
    const currentFeedbacks = filteredFeedbacks.slice(indexOfFirst, indexOfLast);

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
            setAllFeedbacks(data.content);
            setPage(1);
        } catch (err) {
            console.error("Error searching feedback by date:", err);
            setError("Không thể tìm kiếm feedback theo ngày.");
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (event, value) => {
        setPage(value);
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

            {/* Container chứa lọc rating bên trái và tìm kiếm ngày bên phải */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                }}
            >
                {/* Phần lọc rating bên trái */}
                <Box display="flex" alignItems="center" gap={1}>
                    <Rating
                        name="rating-filter"
                        value={ratingFilter}
                        onChange={(event, newValue) => setRatingFilter(newValue)}
                    />
                    <Tooltip title={ratingFilter > 0 ? "Bỏ lọc" : "Lọc theo Rating"}>
                        <IconButton
                            onClick={() => setRatingFilter(0)}
                            size="small"
                        >
                            <FilterListIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
                {/* Phần tìm kiếm theo ngày bên phải */}
                <Box display="flex" alignItems="center" gap={2}>
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
                            p: 0.5,
                        }}
                    >
                        <SearchIcon fontSize="small" sx={{ color: "#fff" }} />
                    </IconButton>
                </Box>
            </Box>

            <TableContainer
                component={Paper}
                elevation={3}
                sx={{ maxWidth: "100%", margin: "auto" }}
            >
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
                                SĐT
                            </TableCell>
                            <TableCell align="center" sx={{ fontWeight: "bold" }}>
                                Rating
                            </TableCell>
                            <TableCell align="center" sx={{ fontWeight: "bold" }}>
                                Chi tiết
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentFeedbacks.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    Không có feedback trong bảng này
                                </TableCell>
                            </TableRow>
                        ) : (
                            currentFeedbacks.map((feedback, index) => (
                                <TableRow
                                    key={feedback.id}
                                    sx={{
                                        backgroundColor:
                                            index % 2 === 0 ? "action.hover" : "background.paper",
                                    }}
                                >
                                    <TableCell align="center">
                                        {indexOfFirst + index + 1}
                                    </TableCell>
                                    <TableCell align="center">
                                        {feedback.codeFeedback}
                                    </TableCell>
                                    <TableCell align="center">
                                        {dayjs(feedback.dateFeedback).format("DD/MM/YYYY HH:mm")}
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
                                        <Rating value={feedback.rating} readOnly />
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton
                                            onClick={() => handleDetail(feedback)}
                                            color="primary"
                                        >
                                            <VisibilityIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {totalPages > 1 && (
                <Box display="flex" justifyContent="center" mt={2}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                    />
                </Box>
            )}

            <FeedbackDetailModal
                open={openModal}
                feedback={selectedFeedback}
                onClose={handleClose}
            />
        </Box>
    );
};

export default FeedBackManagement;
