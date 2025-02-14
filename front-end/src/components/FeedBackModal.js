// FeedbackModal.jsx
import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
} from "@mui/material";

const FeedbackModal = ({ open, handleClose, handleSubmitFeedback }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [content, setContent] = useState("");

    const onSubmit = () => {
        // Tạo payload chứa các thông tin cần thiết, bao gồm cả tên
        const feedbackData = { name, email, phone, content };
        handleSubmitFeedback(feedbackData);

        // Reset form
        setName("");
        setEmail("");
        setPhone("");
        setContent("");
        handleClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>Gửi Phản Hồi</DialogTitle>
            <DialogContent>
                <Box component="form" noValidate autoComplete="off" sx={{ mt: 2 }}>
                    <TextField
                        label="Họ và tên"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        label="Email"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        label="Số điện thoại"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                    <TextField
                        label="Nội dung phản hồi"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        multiline
                        rows={4}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="secondary">
                    Hủy
                </Button>
                <Button
                    onClick={onSubmit}
                    variant="contained"
                    sx={{
                        bgcolor: "#E7B45A",
                        color: "#fff",
                        py: 1,
                        px: 2,          // Giảm padding ngang (nếu cần)
                        fontSize: "0.875rem",  // Giảm kích thước chữ
                        borderRadius: 2,
                        "&:hover": { bgcolor: "#d6a24e" },
                    }}
                >
                    Gửi Phản Hồi
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default FeedbackModal;
