import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    ImageList,
    ImageListItem,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const cloudName = "drszapjl6";
const uploadPreset = "test_cloundinary";

const FeedbackModal = ({ open, handleClose, handleSubmitFeedback }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [content, setContent] = useState("");
    const [selectedFiles, setSelectedFiles] = useState([]); // File objects
    const [previewImages, setPreviewImages] = useState([]); // URL preview
    const uploadImageToCloudinary = async (file) => {
        const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset);
        const response = await fetch(url, {
            method: "POST",
            body: formData,
        });
        const data = await response.json();
        return data.secure_url;
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(files);

        const previews = files.map((file) => URL.createObjectURL(file));
        setPreviewImages(previews);
    };

    const onSubmit = async () => {
        try {
            const uploadedImages = await Promise.all(
                selectedFiles.map((file) => uploadImageToCloudinary(file))
            );

            const feedbackData = { name, email, phone, content, images: uploadedImages };
            await handleSubmitFeedback(feedbackData);

            setName("");
            setEmail("");
            setPhone("");
            setContent("");
            setSelectedFiles([]);
            setPreviewImages([]);
            handleClose();
        } catch (error) {
            console.error("Lỗi khi gửi feedback:", error);
        }
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
                    <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 1 }}>
                        <Button variant="outlined" component="label" startIcon={<CloudUploadIcon />}>
                            Chọn Ảnh
                            <input type="file" accept="image/*" hidden multiple onChange={handleFileChange} />
                        </Button>
                        {selectedFiles.length > 0 && <span>{selectedFiles.length} file(s) đã chọn</span>}
                    </Box>
                    {previewImages.length > 0 && (
                        <ImageList cols={3} rowHeight={100} sx={{ mt: 2 }}>
                            {previewImages.map((src, index) => (
                                <ImageListItem key={index}>
                                    <img src={src} alt={`preview-${index}`} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
                                </ImageListItem>
                            ))}
                        </ImageList>
                    )}
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
                        px: 2,
                        fontSize: "0.875rem",
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
