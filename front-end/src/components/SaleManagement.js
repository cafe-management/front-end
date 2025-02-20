// src/components/SaleManagement.js
import React, { useState, useEffect } from "react";
import {
    Container,
    Typography,
    List,
    ListItem,
    ListItemText,
    CircularProgress,
    Alert,
    Grid,
    Button,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Stack,
    Card,
    CardContent,
    Box,
} from "@mui/material";
import { getTableCoffee, updateTableCoffeeStatus } from "../service/TableCoffeeService";
import { getCartByTableId } from "../service/CartService";
import { createInvoice, assignInvoiceToCart } from "../service/InvoiceService";
import { toast } from "react-toastify";

const SaleManagement = () => {
    const [tables, setTables] = useState([]);
    const [error, setError] = useState(null);
    const [selectedTable, setSelectedTable] = useState(null);
    const [carts, setCarts] = useState([]);
    const [warning, setWarning] = useState("");

    // Lấy danh sách bàn từ API
    const fetchTables = async () => {
        try {
            const data = await getTableCoffee();
            setTables(data);
        } catch (err) {
            setError("Lỗi khi lấy danh sách bàn.");
            console.error("Lỗi khi fetch tables:", err);
        }
    };

    useEffect(() => {
        fetchTables();
    }, []);

    // Khi bàn được chọn, lấy danh sách đơn hàng (carts) theo table id
    // (Chỉ chạy khi bàn được chọn lần đầu)
    useEffect(() => {
        const fetchCart = async () => {
            if (selectedTable) {
                try {
                    const cartsData = await getCartByTableId(selectedTable.id);
                    const filteredCarts = cartsData.filter(cart => cart.invoice_id === null);
                    setCarts(filteredCarts);
                } catch (err) {
                    console.error("Lỗi khi lấy thông tin cart:", err);
                    setCarts([]);
                }
            } else {
                setCarts([]);
            }
        };
        fetchCart();
    }, [selectedTable]);

    // Polling tự động cập nhật lại dữ liệu (bàn và đơn hàng) khi có thay đổi
    useEffect(() => {
        if (selectedTable) {
            const interval = setInterval(() => {
                const refreshData = async () => {
                    try {
                        // Làm mới danh sách đơn hàng của bàn được chọn
                        const cartsData = await getCartByTableId(selectedTable.id);
                        const filteredCarts = cartsData.filter(cart => cart.invoice_id === null);
                        setCarts(filteredCarts);
                        // Làm mới thông tin bàn để cập nhật trạng thái mới
                        const tablesData = await getTableCoffee();
                        const updatedTable = tablesData.find(table => table.id === selectedTable.id);
                        if (updatedTable) {
                            setSelectedTable(updatedTable);
                        }
                    } catch (error) {
                        console.error("Lỗi làm mới dữ liệu:", error);
                    }
                };
                refreshData();
            }, 3000); // Polling mỗi 3 giây
            return () => clearInterval(interval);
        }
    }, [selectedTable]);

    // Tự động xoá cảnh báo sau 3 giây
    useEffect(() => {
        if (warning) {
            const timer = setTimeout(() => {
                setWarning("");
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [warning]);

    // Hàm chuyển đổi trạng thái thành chuỗi mô tả
    const getStatusText = (status) => {
        switch (status) {
            case 1:
                return "Có người ngồi";
            case 0:
                return "Không có người ngồi";
            case 2:
                return "Bảo trì";
            default:
                return "Không xác định";
        }
    };

    // Xử lý chọn bàn
    const handleSelectTable = (table) => {
        setSelectedTable(table);
        setWarning("");
    };

    // Reset trạng thái bàn về "Không có người ngồi" (status 0)
    const handleResetStatus = async () => {
        if (!selectedTable) return;

        if (carts && carts.some((cart) => cart.items && cart.items.length > 0)) {
            setWarning("Bàn có đơn hàng, không thể đặt lại trạng thái!");
            return;
        }

        try {
            const updatedTable = await updateTableCoffeeStatus(selectedTable.id, {
                statusTable: 0,
                token: null,
            });
            // Cập nhật trực tiếp state của bàn được chọn
            setSelectedTable(updatedTable);
            toast.success("Bàn đã cập nhật về trạng thái không có người ngồi");
        } catch (error) {
            console.error("Lỗi cập nhật bàn:", error);
        }
    };

    // Cập nhật trạng thái bàn về "Bảo trì" (status 2)
    const handleMaintenanceStatus = async () => {
        if (!selectedTable) return;
        try {
            const updatedTable = await updateTableCoffeeStatus(selectedTable.id, {
                statusTable: 2,
                token: null,
            });
            setSelectedTable(updatedTable);
            toast.warning("Bàn đã cập nhập về trạng thái bảo trì");
        } catch (error) {
            console.error("Lỗi cập nhật bàn:", error);
        }
    };

    // Tính tổng tiền của tất cả các đơn hàng (carts)
    const overallTotal = carts.reduce((acc, cart) => {
        const cartTotal = cart.items
            ? cart.items.reduce((sum, item) => sum + item.totalPrice, 0)
            : 0;
        return acc + cartTotal;
    }, 0);

    // Tạo hóa đơn và gán mã hóa đơn cho từng cart
    const handlePayment = async () => {
        if (carts.length === 0) {
            toast.error("Không có đơn hàng để thanh toán!");
            return;
        }

        try {
            const codeInvoice = `INV-${Date.now()}`;
            const invoicePayload = {
                codeInvoice,
                dateCreate: new Date().toISOString(),
                datePayment: new Date().toISOString(),
                statusOrder: true, // Đã thanh toán
                totalAmount: overallTotal,
                carts,
                user: { id: localStorage.getItem("userId") }
            };

            const createdInvoice = await createInvoice(invoicePayload);
            console.log("Invoice created:", createdInvoice);
            toast.success(
                `Thanh toán thành công. Tổng tiền: ${overallTotal.toLocaleString()} đ`
            );

            const invoiceId = createdInvoice.id;
            const assignPromises = carts.map((cart) =>
                assignInvoiceToCart(invoiceId, cart.id)
            );
            await Promise.all(assignPromises);

            // Sau khi thanh toán, reset danh sách carts
            setCarts([]);
        } catch (err) {
            console.error("Error processing payment", err);
        }
    };

    const formatter = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    });

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom align="center">
                Quản Lý Bàn & Đơn Hàng
            </Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <Grid container spacing={3}>
                {/* Danh sách bàn */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Danh sách bàn & Trạng thái
                            </Typography>
                            {tables.length > 0 ? (
                                <List>
                                    {tables.map((table) => (
                                        <ListItem
                                            key={table.id}
                                            divider
                                            button
                                            selected={selectedTable && selectedTable.id === table.id}
                                            onClick={() => handleSelectTable(table)}
                                            sx={{ "&.Mui-selected": { backgroundColor: "#e0f7fa" } }}
                                        >
                                            <ListItemText
                                                primary={`Bàn số: ${table.numberTable}`}
                                                secondary={`Trạng thái: ${getStatusText(table.statusTable)}`}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            ) : (
                                !error && (
                                    <Box display="flex" justifyContent="center" alignItems="center">
                                        <CircularProgress />
                                    </Box>
                                )
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Thông tin bàn được chọn */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Thông tin bàn được chọn
                            </Typography>
                            {selectedTable ? (
                                <>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>ID</TableCell>
                                                <TableCell>Số bàn</TableCell>
                                                <TableCell>Trạng thái</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>{selectedTable.id}</TableCell>
                                                <TableCell>{selectedTable.numberTable}</TableCell>
                                                <TableCell>{getStatusText(selectedTable.statusTable)}</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                    {warning && (
                                        <Alert severity="warning" sx={{ mt: 2 }}>
                                            {warning}
                                        </Alert>
                                    )}
                                    <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                                        <Button variant="contained" color="primary" onClick={handleResetStatus}>
                                            Đặt lại trạng thái
                                        </Button>
                                        <Button variant="contained" color="warning" onClick={handleMaintenanceStatus}>
                                            Bảo trì
                                        </Button>
                                    </Stack>
                                </>
                            ) : (
                                <Typography align="center" sx={{ mt: 2 }}>
                                    Chưa có dữ liệu. Vui lòng chọn bàn.
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Hiển thị danh sách đơn hàng nếu có bàn được chọn */}
                {selectedTable && (
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Thông tin Đơn Hàng
                                </Typography>
                                {carts.length > 0 ? (
                                    carts.map((cart, index) => (
                                        <Box
                                            key={cart.id}
                                            sx={{ mb: 3, p: 2, border: "1px solid #ccc", borderRadius: 1 }}
                                        >
                                            <Typography variant="subtitle1" sx={{ mb: 1, textAlign: "left" }}>
                                                Đơn hàng #{index + 1}
                                            </Typography>
                                            <Table size="small">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell sx={{ fontWeight: "bold" }}>Tên đồ uống</TableCell>
                                                        <TableCell sx={{ fontWeight: "bold" }}>Giá</TableCell>
                                                        <TableCell sx={{ fontWeight: "bold" }}>Số lượng</TableCell>
                                                        <TableCell sx={{ fontWeight: "bold" }}>Tổng tiền</TableCell>
                                                        <TableCell sx={{ fontWeight: "bold" }}>Số bàn</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {cart.items.map((item) => (
                                                        <TableRow key={item.id}>
                                                            <TableCell>{item.drink.nameDrinks}</TableCell>
                                                            <TableCell>{formatter.format(item.drink.price)}</TableCell>
                                                            <TableCell>{item.quantity}</TableCell>
                                                            <TableCell>{formatter.format(item.totalPrice)}</TableCell>
                                                            <TableCell>{cart.table.numberTable}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </Box>
                                    ))
                                ) : (
                                    <Typography align="center" sx={{ mt: 2 }}>
                                        Không có thông tin cart hoặc chưa có đơn hàng.
                                    </Typography>
                                )}

                                {/* Hiển thị tổng tiền chung và nút "Tính tiền" */}
                                {carts.length > 0 && (
                                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
                                        <Typography variant="h6">
                                            Tổng tiền chung: {overallTotal.toLocaleString()} đ
                                        </Typography>
                                        <Button variant="contained" color="success" onClick={handlePayment}>
                                            Tính tiền
                                        </Button>
                                    </Stack>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                )}
            </Grid>
        </Container>
    );
};

export default SaleManagement;
