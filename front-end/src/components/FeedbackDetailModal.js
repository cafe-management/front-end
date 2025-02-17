import React, { useEffect, useState } from "react";
import {
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    ImageList,
    ImageListItem,
    Typography,
    Grid,
} from "@mui/material";
import ImageModal from "./ImageModal";
import dayjs from 'dayjs';

const FeedbackDetailForm = ({ open, feedback, onClose }) => {
    const [formData, setFormData] = useState({
        codeFeedback: "",
        dateFeedback: "",
        nameCustomer: "",
        email: "",
        phoneCustomer: "",
        content: "",
    });
    const [openImageModal, setOpenImageModal] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    useEffect(() => {
        if (feedback) {
            setFormData({
                codeFeedback: feedback.codeFeedback,
                dateFeedback: new Date(feedback.dateFeedback).toLocaleString(),
                nameCustomer: feedback.customer
                    ? feedback.customer.nameCustomer || feedback.customer.id
                    : "",
                email: feedback.customer ? feedback.customer.email : "",
                phoneCustomer: feedback.customer ? feedback.customer.phoneCustomer : "",
                content: feedback.content,
            });
        }
    }, [feedback]);

    const handleImageClick = (index) => {
        setSelectedImageIndex(index);
        setOpenImageModal(true);
    };

    const handlePrevImage = () => {
        setSelectedImageIndex((prev) =>
            prev > 0 ? prev - 1 : feedback.images.length - 1
        );
    };

    const handleNextImage = () => {
        setSelectedImageIndex((prev) =>
            prev < feedback.images.length - 1 ? prev + 1 : 0
        );
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
                <DialogTitle>Chi tiết Feedback</DialogTitle>
                <DialogContent dividers>
                    {feedback ? (
                        <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Mã Feedback"
                                        name="codeFeedback"
                                        value={formData.codeFeedback}
                                        fullWidth
                                        InputProps={{ readOnly: true }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Ngày Feedback"
                                        name="dateFeedback"
                                        value={dayjs(formData.dateFeedback).format('DD/MM/YYYY HH:mm')}
                                        fullWidth
                                        InputProps={{ readOnly: true }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Khách hàng"
                                        name="nameCustomer"
                                        value={formData.nameCustomer}
                                        fullWidth
                                        InputProps={{ readOnly: true }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Email"
                                        name="email"
                                        value={formData.email}
                                        fullWidth
                                        InputProps={{ readOnly: true }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Số Điện Thoại"
                                        name="phoneCustomer"
                                        value={formData.phoneCustomer}
                                        fullWidth
                                        InputProps={{ readOnly: true }}
                                    />
                                </Grid>
                            </Grid>
                            {/* Nội dung feedback */}
                            <TextField
                                label="Nội dung"
                                name="content"
                                value={formData.content}
                                fullWidth
                                multiline
                                rows={4}
                                InputProps={{ readOnly: true }}
                            />
                            {/* Hiển thị hình ảnh dạng lưới */}
                            {feedback.images && feedback.images.length > 0 && (
                                <Box mt={2}>
                                    <Typography variant="subtitle1" gutterBottom>
                                        Hình ảnh phản hồi:
                                    </Typography>
                                    <ImageList cols={3} rowHeight={160} gap={8}>
                                        {feedback.images.map((image, index) => (
                                            <ImageListItem key={image.id}>
                                                <img
                                                    src={image.img}
                                                    alt={`Hình ảnh ${image.id}`}
                                                    loading="lazy"
                                                    style={{
                                                        objectFit: "cover",
                                                        width: "100%",
                                                        height: "100%",
                                                        cursor: "pointer",
                                                    }}
                                                    onClick={() => handleImageClick(index)}
                                                />
                                            </ImageListItem>
                                        ))}
                                    </ImageList>
                                </Box>
                            )}
                        </Box>
                    ) : (
                        <Typography>Không có thông tin.</Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={onClose}
                        variant="contained"
                        sx={{
                            backgroundColor: "#E7B45A",
                            "&:hover": { backgroundColor: "#dba147" },
                        }}
                    >
                        Đóng
                    </Button>
                </DialogActions>
            </Dialog>

            <ImageModal
                open={openImageModal}
                images={feedback ? feedback.images : []}
                selectedIndex={selectedImageIndex}
                onClose={() => setOpenImageModal(false)}
                onPrev={handlePrevImage}
                onNext={handleNextImage}
            />
        </>
    );
};

export default FeedbackDetailForm;
