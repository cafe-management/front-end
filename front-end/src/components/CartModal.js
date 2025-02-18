import React from "react";
import {
    Modal,
    Box,
    Typography,
    Button,
    IconButton,
    Divider,
    Stack,
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
                            onClick={handlePayment}
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
