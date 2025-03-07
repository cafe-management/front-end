import React, { useState, useEffect } from "react";
import { getCartById } from "../service/CartService";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Typography,
    CircularProgress,
    Box,
} from "@mui/material";

const OrderManagement = ({ cartId }) => {
    const [cart, setCart] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchCart = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getCartById(cartId);
            setCart(data);
        } catch (err) {
            setError("Có lỗi xảy ra khi lấy thông tin đơn hàng. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    const handleRetry = () => {
        fetchCart();
    };

    useEffect(() => {
        fetchCart();
    }, [cartId]);

    if (loading) {
        return (
            <Box sx={{ textAlign: "center", mt: 4 }}>
                <CircularProgress />
                <Typography variant="body1" sx={{ mt: 2 }}>
                    Đang tải thông tin đơn hàng...
                </Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ textAlign: "center", mt: 4 }}>
                <Typography variant="body1" color="error">
                    {error}
                </Typography>
                <Button variant="contained" onClick={handleRetry} sx={{ mt: 2 }}>
                    Thử lại
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
                Thông tin đơn hàng
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID đơn hàng</TableCell>
                            <TableCell>Số lượng sản phẩm</TableCell>
                            <TableCell>Bàn</TableCell>
                            <TableCell>Hóa đơn</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {cart ? (
                            <TableRow>
                                <TableCell>{cart.id}</TableCell>
                                <TableCell>{cart.items ? cart.items.length : 0}</TableCell>
                                <TableCell>{cart.table ? cart.table.name : "Không xác định"}</TableCell>
                                <TableCell>{cart.invoice ? cart.invoice.code : "Chưa có"}</TableCell>
                            </TableRow>
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    Không có thông tin đơn hàng nào
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default OrderManagement;
