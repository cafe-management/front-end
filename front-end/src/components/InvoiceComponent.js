import React, { useEffect, useState } from "react";
import { getAllInvoice } from "../service/InvoiceService";
import {
    Box,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
    TextField,
    InputAdornment,
    Button
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import InfoIcon from "@mui/icons-material/Info";
import SearchIcon from "@mui/icons-material/Search";
import dayjs from "dayjs";

const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
});

const InvoiceComponent = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDetail, setOpenDetail] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [searchCreator, setSearchCreator] = useState("");

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const data = await getAllInvoice();
                setInvoices(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchInvoices();
    }, []);

    // Lọc hóa đơn theo tên người tạo
    const filteredInvoices = invoices.filter((invoice) =>
        invoice.user && invoice.user.fullName
            ? invoice.user.fullName.toLowerCase().includes(searchCreator.toLowerCase())
            : false
    );

    const handlePrintInvoice = (invoice) => {
        console.log("In hóa đơn giấy:", invoice);
    };

    const handleOpenDetail = (invoice) => {
        setSelectedInvoice(invoice);
        setOpenDetail(true);
    };

    const handleCloseDetail = () => {
        setOpenDetail(false);
        setSelectedInvoice(null);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Typography variant="h6" color="error" align="center" mt={4}>
                Lỗi khi lấy hóa đơn: {error.message}
            </Typography>
        );
    }

    return (
        <Box mx={2} my={4}>
            {/* Tiêu đề ở giữa */}
            <Typography variant="h4" align="center" gutterBottom>
                Danh Sách Hóa Đơn
            </Typography>

            {/* Ô tìm kiếm nằm bên phải */}
            <Box display="flex" justifyContent="flex-end" mb={3}>
                <TextField
                    label="Tìm theo người tạo"
                    variant="outlined"
                    size="small"
                    value={searchCreator}
                    onChange={(e) => setSearchCreator(e.target.value)}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() => {
                                        /* Nếu cần logic tìm kiếm thêm, xử lý tại đây */
                                    }}
                                    sx={{ color: "#E7B45A" }}
                                >
                                    <SearchIcon />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>

            <TableContainer component={Paper} elevation={3} sx={{ maxWidth: "100%", margin: "auto" }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" sx={{ fontWeight: "bold" }}>
                                Mã Hóa Đơn
                            </TableCell>
                            <TableCell align="center" sx={{ fontWeight: "bold" }}>
                                Ngày Tạo
                            </TableCell>
                            <TableCell align="center" sx={{ fontWeight: "bold" }}>
                                Ngày Thanh Toán
                            </TableCell>
                            <TableCell align="center" sx={{ fontWeight: "bold" }}>
                                Trạng Thái
                            </TableCell>
                            <TableCell align="center" sx={{ fontWeight: "bold" }}>
                                Tổng Tiền
                            </TableCell>
                            <TableCell align="center" sx={{ fontWeight: "bold" }}>
                                Người Tạo
                            </TableCell>
                            <TableCell align="center" sx={{ fontWeight: "bold" }}>
                                In Hóa Đơn Giấy
                            </TableCell>
                            <TableCell align="center" sx={{ fontWeight: "bold" }}>
                                Chi Tiết
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredInvoices.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center">
                                    Không tìm thấy hóa đơn nào
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredInvoices.map((invoice, index) => (
                                <TableRow
                                    key={invoice.id}
                                    sx={{
                                        backgroundColor: index % 2 === 0 ? "action.hover" : "background.paper",
                                    }}
                                >
                                    <TableCell align="center">{invoice.codeInvoice}</TableCell>
                                    <TableCell align="center">
                                        {dayjs(invoice.dateCreate).format("DD/MM/YYYY HH:mm")}
                                    </TableCell>
                                    <TableCell align="center">
                                        {invoice.datePayment
                                            ? dayjs(invoice.datePayment).format("DD/MM/YYYY HH:mm")
                                            : "N/A"}
                                    </TableCell>
                                    <TableCell align="center">
                                        {invoice.statusOrder ? "Đã hoàn thành" : "Chưa hoàn thành"}
                                    </TableCell>
                                    <TableCell align="center">{formatter.format(invoice.totalAmount)}</TableCell>
                                    <TableCell align="center">
                                        {invoice.user && invoice.user.fullName ? invoice.user.fullName : "N/A"}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title="In Hóa Đơn Giấy">
                                            <IconButton color="primary" onClick={() => handlePrintInvoice(invoice)}>
                                                <PrintIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title="Xem Chi Tiết">
                                            <IconButton color="primary" onClick={() => handleOpenDetail(invoice)}>
                                                <InfoIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Dialog chi tiết hóa đơn */}
            <Dialog open={openDetail} onClose={handleCloseDetail} fullWidth maxWidth="sm">
                <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>HÓA ĐƠN</DialogTitle>
                <DialogContent dividers>
                    {selectedInvoice && (
                        <Box>
                            {/* Header cửa hàng */}
                            <Box sx={{ textAlign: "center", mb: 2 }}>
                                <Typography variant="h6" fontWeight="bold">
                                    Dana Coffee
                                </Typography>
                                <Typography variant="body2">
                                    Địa chỉ: Số 123, Đường ABC, Quận 1, TP.HCM
                                </Typography>
                                <Typography variant="body2">SĐT: 0123 456 789</Typography>
                            </Box>
                            {/* Thông tin hóa đơn căn chỉnh 2 cột */}
                            <Box sx={{ mb: 2, px: 1 }}>
                                <Grid container spacing={1}>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="body2">
                                            <strong>Mã Hóa Đơn:</strong> {selectedInvoice.codeInvoice}
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>Ngày Tạo:</strong>{" "}
                                            {dayjs(selectedInvoice.dateCreate).format("DD/MM/YYYY HH:mm")}
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>Email:</strong>{" "}
                                            {selectedInvoice.user && selectedInvoice.user.email
                                                ? selectedInvoice.user.email
                                                : "N/A"}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6} sx={{ textAlign: "right" }}>
                                        <Typography variant="body2">
                                            <strong>Người Tạo:</strong>{" "}
                                            {selectedInvoice.user && selectedInvoice.user.fullName
                                                ? selectedInvoice.user.fullName
                                                : "N/A"}
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>Số Bàn:</strong>{" "}
                                            {selectedInvoice.carts &&
                                            selectedInvoice.carts.length > 0 &&
                                            selectedInvoice.carts[0].table &&
                                            selectedInvoice.carts[0].table.numberTable
                                                ? selectedInvoice.carts[0].table.numberTable
                                                : "N/A"}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>

                            {/* Danh sách món ăn */}
                            <TableContainer component={Paper} sx={{ mb: 2 }}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center" sx={{ fontWeight: "bold" }}>
                                                STT
                                            </TableCell>
                                            <TableCell align="center" sx={{ fontWeight: "bold" }}>
                                                Tên Món
                                            </TableCell>
                                            <TableCell align="center" sx={{ fontWeight: "bold" }}>
                                                Số Lượng
                                            </TableCell>
                                            <TableCell align="center" sx={{ fontWeight: "bold" }}>
                                                Đơn Giá
                                            </TableCell>
                                            <TableCell align="center" sx={{ fontWeight: "bold" }}>
                                                Thành Tiền
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {selectedInvoice.carts &&
                                            selectedInvoice.carts.map((cart, idx) =>
                                                cart.items &&
                                                cart.items.map((item, i) => (
                                                    <TableRow key={`${idx}-${i}`}>
                                                        <TableCell align="center">{i + 1}</TableCell>
                                                        <TableCell align="center">
                                                            {item.drink?.nameDrinks || "N/A"}
                                                        </TableCell>
                                                        <TableCell align="center">{item.quantity}</TableCell>
                                                        <TableCell align="center">
                                                            {formatter.format(item.drink?.price)}
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            {formatter.format(item.totalPrice)}
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            {/* Tổng kết */}
                            <Box sx={{ display: "flex", justifyContent: "flex-end", pr: 1, mb: 1 }}>
                                <Typography variant="body2" fontWeight="bold">
                                    Tổng Cộng: {formatter.format(selectedInvoice.totalAmount)}
                                </Typography>
                            </Box>
                            <Box sx={{ textAlign: "center" }}>
                                <Typography variant="body2">Cảm ơn quý khách!</Typography>
                            </Box>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDetail} color="primary">
                        Đóng
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default InvoiceComponent;
