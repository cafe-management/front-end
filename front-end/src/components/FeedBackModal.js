import React, { useState, useEffect, useRef } from "react";
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
    CircularProgress,
    Typography,
    IconButton
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from '@mui/icons-material/Delete';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const cloudName = "drszapjl6";
const uploadPreset = "test_cloundinary";

const FeedbackModal = ({ open, handleClose, handleSubmitFeedback }) => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // State để mở modal xem ảnh chi tiết
    const [openPreviewModal, setOpenPreviewModal] = useState(false);
    const [currentPreviewImage, setCurrentPreviewImage] = useState("");

    const previousUrlsRef = useRef([]);

    useEffect(() => {
        return () => {
            previousUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
        };
    }, []);

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

    const handleFileChange = (e, setFieldValue) => {
        // Revoke old URLs
        previousUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
        previousUrlsRef.current = [];

        const files = Array.from(e.target.files);
        setSelectedFiles(files);
        setFieldValue("images", files);

        const previews = files.map((file) => {
            const url = URL.createObjectURL(file);
            previousUrlsRef.current.push(url);
            return url;
        });
        setPreviewImages(previews);
    };

    // Xóa ảnh đã chọn khỏi previewImages và selectedFiles
    const handleDeleteImage = (index) => {
        setPreviewImages((prev) => prev.filter((_, i) => i !== index));
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    };

    // Mở modal xem ảnh chi tiết
    const handleOpenPreview = (src) => {
        setCurrentPreviewImage(src);
        setOpenPreviewModal(true);
    };

    return (
        <>
            <Dialog open={open} onClose={!isSubmitting ? handleClose : undefined} fullWidth maxWidth="sm">
                <DialogTitle>Gửi Phản Hồi</DialogTitle>
                <DialogContent>
                    <Formik
                        initialValues={{
                            name: "",
                            email: "",
                            phone: "",
                            content: "",
                            images: []
                        }}
                        validationSchema={Yup.object({
                            name: Yup.string().required("Vui lòng nhập họ và tên"),
                            email: Yup.string().email("Email không hợp lệ").required("Vui lòng nhập email"),
                            phone: Yup.string()
                                .matches(/^[0-9]+$/, "Số điện thoại không hợp lệ")
                                .required("Vui lòng nhập số điện thoại"),
                            content: Yup.string().required("Vui lòng nhập nội dung phản hồi"),
                            images: Yup.array()
                        })}
                        onSubmit={async (values, { setSubmitting, setErrors, resetForm }) => {
                            setIsSubmitting(true);
                            setErrors({});

                            try {
                                const uploadedImages = await Promise.all(
                                    values.images.map((file) => uploadImageToCloudinary(file))
                                );

                                const feedbackData = { ...values, images: uploadedImages };
                                await handleSubmitFeedback(feedbackData);

                                resetForm();
                                setSelectedFiles([]);
                                setPreviewImages([]);
                                handleClose();
                            } catch (error) {
                                console.error("Lỗi khi gửi feedback:", error);
                                if (error.response && error.response.data) {
                                    setErrors(error.response.data);
                                }
                            } finally {
                                setIsSubmitting(false);
                                setSubmitting(false);
                            }
                        }}
                    >
                        {({ setFieldValue, errors, touched, isSubmitting }) => (
                            <Form noValidate autoComplete="off">
                                <Box sx={{ mt: 2 }}>
                                    <Field
                                        as={TextField}
                                        name="name"
                                        label="Họ và tên"
                                        variant="outlined"
                                        fullWidth
                                        margin="normal"
                                        error={touched.name && Boolean(errors.name)}
                                        helperText={<ErrorMessage name="name" component="span" style={{ color: "red" }} />}
                                    />
                                    <Field
                                        as={TextField}
                                        name="email"
                                        label="Email"
                                        variant="outlined"
                                        fullWidth
                                        margin="normal"
                                        error={touched.email && Boolean(errors.email)}
                                        helperText={<ErrorMessage name="email" component="span" style={{ color: "red" }} />}
                                    />
                                    <Field
                                        as={TextField}
                                        name="phone"
                                        label="Số điện thoại"
                                        variant="outlined"
                                        fullWidth
                                        margin="normal"
                                        error={touched.phone && Boolean(errors.phone)}
                                        helperText={<ErrorMessage name="phone" component="span" style={{ color: "red" }} />}
                                    />
                                    <Field
                                        as={TextField}
                                        name="content"
                                        label="Nội dung phản hồi"
                                        variant="outlined"
                                        fullWidth
                                        margin="normal"
                                        multiline
                                        rows={4}
                                        error={touched.content && Boolean(errors.content)}
                                        helperText={<ErrorMessage name="content" component="span" style={{ color: "red" }} />}
                                    />
                                    <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 1 }}>
                                        <Button
                                            variant="outlined"
                                            component="label"
                                            startIcon={<CloudUploadIcon />}
                                        >
                                            Chọn Ảnh
                                            <input
                                                type="file"
                                                accept="image/*"
                                                hidden
                                                multiple
                                                onChange={(e) => handleFileChange(e, setFieldValue)}
                                            />
                                        </Button>
                                        {selectedFiles.length > 0 && (
                                            <span>{selectedFiles.length} file(s) đã chọn</span>
                                        )}
                                    </Box>
                                    {previewImages.length > 0 && (
                                        <ImageList cols={3} rowHeight={100} sx={{ mt: 2 }}>
                                            {previewImages.map((src, index) => (
                                                <ImageListItem key={index} sx={{ position: "relative" }}>
                                                    <img
                                                        src={src}
                                                        alt={`preview-${index}`}
                                                        style={{
                                                            objectFit: "cover",
                                                            width: "100%",
                                                            height: "100%",
                                                            cursor: "pointer"
                                                        }}
                                                        onClick={() => handleOpenPreview(src)}
                                                    />
                                                    <IconButton
                                                        onClick={() => handleDeleteImage(index)}
                                                        sx={{
                                                            position: "absolute",
                                                            top: 4,
                                                            right: 4,
                                                            bgcolor: "rgba(255,255,255,0.8)",
                                                            "&:hover": { bgcolor: "rgba(255,255,255,1)" },
                                                            padding: "4px",
                                                            borderRadius: "50%"
                                                        }}
                                                    >
                                                        <DeleteIcon color="error" fontSize="small" />
                                                    </IconButton>
                                                </ImageListItem>
                                            ))}
                                        </ImageList>
                                    )}
                                    <ErrorMessage name="images" component={Typography} sx={{ color: "red", mt: 1 }} />
                                </Box>
                                <DialogActions>
                                    <Button
                                        onClick={!isSubmitting ? handleClose : undefined}
                                        color="secondary"
                                        disabled={isSubmitting}
                                    >
                                        Hủy
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={isSubmitting}
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
                                        {isSubmitting ? (
                                            <CircularProgress size={24} color="inherit" />
                                        ) : (
                                            "Gửi Phản Hồi"
                                        )}
                                    </Button>
                                </DialogActions>
                            </Form>
                        )}
                    </Formik>
                </DialogContent>
            </Dialog>

            {/* Modal xem ảnh chi tiết */}
            <Dialog
                open={openPreviewModal}
                onClose={() => setOpenPreviewModal(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogContent sx={{ p: 0 }}>
                    <img
                        src={currentPreviewImage}
                        alt="Xem chi tiết"
                        style={{ width: "100%", height: "auto", display: "block" }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenPreviewModal(false)} color="primary">
                        Đóng
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default FeedbackModal;
