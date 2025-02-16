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
    Paper,
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

const SaleManagement = () => {
    const [tables, setTables] = useState([]);
    const [error, setError] = useState(null);
    const [selectedTable, setSelectedTable] = useState(null);
    const [cart, setCart] = useState(null);

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

    // Khi bàn được chọn, lấy thông tin cart dựa theo table id
    useEffect(() => {
        const fetchCart = async () => {
            if (selectedTable) {
                try {
                    const cartData = await getCartByTableId(selectedTable.id);
                    setCart(cartData);
                } catch (err) {
                    console.error("Lỗi khi lấy thông tin cart:", err);
                    setCart(null);
                }
            } else {
                setCart(null);
            }
        };
        fetchCart();
    }, [selectedTable]);

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

    // Xử lý chọn bàn từ danh sách
    const handleSelectTable = (table) => {
        setSelectedTable(table);
    };

    // Hàm đặt lại trạng thái của bàn đã chọn về 0 và xóa token
    const handleResetStatus = async () => {
        if (!selectedTable) return;
        try {
            const updatedTable = await updateTableCoffeeStatus(selectedTable.id, {
                statusTable: 0,
                token: null,
            });
            console.log("Bàn đã được cập nhật:", updatedTable);
            await fetchTables();
            setSelectedTable(updatedTable);
        } catch (error) {
            console.error("Lỗi cập nhật bàn:", error);
        }
    };

    // Hàm cập nhật trạng thái bàn về Bảo trì (status 2)
    const handleMaintenanceStatus = async () => {
        if (!selectedTable) return;
        try {
            const updatedTable = await updateTableCoffeeStatus(selectedTable.id, {
                statusTable: 2,
                token: null,
            });
            console.log("Bàn đã được cập nhật về bảo trì:", updatedTable);
            await fetchTables();
            setSelectedTable(updatedTable);
        } catch (error) {
            console.error("Lỗi cập nhật bàn:", error);
        }
    };

    // Tính tổng tiền của cart
    const totalCart =
        cart && cart.items && cart.items.length > 0
            ? cart.items.reduce((acc, item) => acc + item.totalPrice, 0)
            : 0;

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

                {/* Thông tin cart nếu có bàn được chọn */}
                {selectedTable && (
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Thông tin Đơn Hàng
                                </Typography>
                                {cart && cart.items && cart.items.length > 0 ? (
                                    <>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Tên đồ uống</TableCell>
                                                    <TableCell>Giá</TableCell>
                                                    <TableCell>Số lượng</TableCell>
                                                    <TableCell>Tổng tiền</TableCell>
                                                    <TableCell>Số bàn</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {cart.items.map((item) => (
                                                    <TableRow key={item.id}>
                                                        <TableCell>{item.drink.nameDrinks}</TableCell>
                                                        <TableCell>{item.drink.price}</TableCell>
                                                        <TableCell>{item.quantity}</TableCell>
                                                        <TableCell>{item.totalPrice}</TableCell>
                                                        <TableCell>{cart.table.numberTable}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                        <Stack
                                            direction="row"
                                            justifyContent="space-between"
                                            alignItems="center"
                                            sx={{ mt: 2 }}
                                        >
                                            <Typography variant="h6">
                                                Tổng tiền: {totalCart.toLocaleString()} đ
                                            </Typography>
                                            <Button variant="contained" color="success" onClick={() => {}}>
                                                Tính tiền
                                            </Button>
                                        </Stack>
                                    </>
                                ) : (
                                    <Typography align="center" sx={{ mt: 2 }}>
                                        Không có thông tin cart hoặc chưa có đơn hàng.
                                    </Typography>
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
