import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Box } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const ImageModal = ({ open, images, selectedIndex, onClose, onPrev, onNext }) => {
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>Hình ảnh phản hồi</DialogTitle>
            <DialogContent
                sx={{
                    position: "relative",
                    textAlign: "center",
                    backgroundColor: "#000",
                }}
            >
                {images && images.length > 0 && (
                    <Box sx={{ position: "relative" }}>
                        <img
                            src={images[selectedIndex].img}
                            alt={`Hình ảnh ${images[selectedIndex].id}`}
                            style={{ width: "100%", height: "auto", display: "block" }}
                        />
                        {/* Icon điều hướng trái */}
                        <IconButton
                            onClick={onPrev}
                            sx={{
                                position: "absolute",
                                top: "50%",
                                left: 0,
                                transform: "translateY(-50%)",
                                color: "#fff",
                            }}
                        >
                            <ArrowBackIosIcon />
                        </IconButton>
                        {/* Icon điều hướng phải */}
                        <IconButton
                            onClick={onNext}
                            sx={{
                                position: "absolute",
                                top: "50%",
                                right: 0,
                                transform: "translateY(-50%)",
                                color: "#fff",
                            }}
                        >
                            <ArrowForwardIosIcon />
                        </IconButton>
                    </Box>
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
    );
};

export default ImageModal;
