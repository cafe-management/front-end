import React, { useState, useEffect } from "react";
import {
    Modal,
    Box,
    Typography,
    Button,
    IconButton,
    Divider,
    Stack,
    TextField, // Import TextField từ MUI
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const CartModal = ({
                       open,
                       handleClose,
                       cartItems,
                       adjustQuantity,
                       removeFromCart,
                       formatPrice,
                       totalCartPrice,
                       handlePayment,
                   }) => {
    // State lưu trữ nội dung ghi chú khi đặt món
    const [note, setNote] = useState("");

    // Khi cartItems thay đổi, nếu giỏ hàng rỗng thì reset note
    useEffect(() => {
        if (cartItems.length === 0) {
            setNote("");
        }
    }, [cartItems]);

    return (
        <Modal open={open} onClose={handleClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: { xs: "90%", sm: 500 },
                    bgcolor: "background.paper",
                    borderRadius: 2,
                    boxShadow: 24,
                    p: 3,
                    maxHeight: "80vh",
                    overflowY: "auto",
                }}
            >
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6" fontWeight="bold">
                        Giỏ hàng
                    </Typography>
                    <IconButton onClick={handleClose} sx={{ color: "gray" }}>
                        <CloseIcon />
                    </IconButton>
                </Stack>

                {cartItems.length > 0 ? (
                    <>
                        {cartItems.map((item) => (
                            <Box
                                key={item.id}
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    py: 1,
                                }}
                            >
                                <Box>
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        {item.name}
                                    </Typography>
                                    <Stack direction="row" alignItems="center" spacing={1} mt={1}>
                                        <Button
                                            variant="contained"
                                            size="small"
                                            onClick={() => adjustQuantity(item.id, -1)}
                                            sx={{
                                                bgcolor: "grey.500",
                                                minWidth: "30px",
                                                p: 0,
                                                "&:hover": { bgcolor: "grey.700" },
                                            }}
                                        >
                                            -
                                        </Button>
                                        <Typography>{item.quantity}</Typography>
                                        <Button
                                            variant="contained"
                                            size="small"
                                            onClick={() => adjustQuantity(item.id, 1)}
                                            sx={{
                                                bgcolor: "grey.500",
                                                minWidth: "30px",
                                                p: 0,
                                                "&:hover": { bgcolor: "grey.700" },
                                            }}
                                        >
                                            +
                                        </Button>
                                    </Stack>
                                </Box>
                                <Box textAlign="right">
                                    <Typography variant="subtitle1">
                                        {formatPrice(item.price * item.quantity)}
                                    </Typography>
                                    <Button
                                        onClick={() => removeFromCart(item.id)}
                                        sx={{ color: "red", fontSize: "0.8rem", mt: 0.5 }}
                                    >
                                        Xóa
                                    </Button>
                                </Box>
                            </Box>
                        ))}

                        <Divider sx={{ my: 2 }} />
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mb: 2,
                            }}
                        >
                            <Typography variant="h6" fontWeight="bold">
                                Tổng tiền
                            </Typography>
                            <Typography variant="h6" fontWeight="bold">
                                {formatPrice(totalCartPrice)}
                            </Typography>
                        </Box>

                        {/* Trường nhập cho ghi chú khi đặt món */}
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            variant="outlined"
                            placeholder="Thêm ghi chú cho đơn hàng"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            sx={{ mb: 2 }}
                        />

                        <Button
                            variant="contained"
                            fullWidth
                            sx={{
                                bgcolor: "#E7B45A",
                                color: "#fff",
                                py: 1.5,
                                fontSize: "1rem",
                                borderRadius: 2,
                                "&:hover": { bgcolor: "#d6a24e" },
                            }}
                            // Truyền giá trị note vào hàm handlePayment khi đặt món, sau đó xoá note
                            onClick={() => {
                                handlePayment(note);
                                setNote("");
                            }}
                        >
                            Gọi Món
                        </Button>
                    </>
                ) : (
                    <Typography variant="body1" align="center">
                        Giỏ hàng trống!
                    </Typography>
                )}
            </Box>
        </Modal>
    );
};

export default CartModal;
