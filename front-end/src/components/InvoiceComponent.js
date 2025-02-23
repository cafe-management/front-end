import React, { useEffect, useState, useRef } from "react";
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
    Button,
    Pagination,
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import InfoIcon from "@mui/icons-material/Info";
import SearchIcon from "@mui/icons-material/Search";
import dayjs from "dayjs";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
});

const InvoiceComponent = () => {
    // State phân trang
    const [page, setPage] = useState(0);
    const [size] = useState(5);
    const [totalPages, setTotalPages] = useState(0);

    // State dữ liệu và loading
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State Dialog chi tiết hóa đơn
    const [openDetail, setOpenDetail] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);

    // State tìm kiếm theo người tạo
    const [searchCreator, setSearchCreator] = useState("");

    // Ref dùng để tham chiếu nội dung cần chuyển PDF
    const printRef = useRef();

    // Fetch invoices (sử dụng phân trang phía server)
    useEffect(() => {
        const fetchInvoices = async () => {
            setLoading(true);
            try {
                const data = await getAllInvoice(page, size);
                if (data && data.content) {
                    // Nếu API trả về đối tượng phân trang
                    setInvoices(data.content);
                    setTotalPages(data.totalPages || 0);
                } else if (Array.isArray(data)) {
                    // Nếu API trả về mảng, tính số trang trên client
                    setInvoices(data);
                    setTotalPages(Math.ceil(data.length / size));
                } else {
                    setInvoices([]);
                    setTotalPages(0);
                }
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchInvoices();
    }, [page, size]);

    // Lọc hóa đơn theo tên người tạo (áp dụng trên dữ liệu đã được phân trang từ server)
    const filteredInvoices = invoices.filter((invoice) =>
        invoice.user && invoice.user.fullName
            ? invoice.user.fullName.toLowerCase().includes(searchCreator.toLowerCase())
            : false
    );

    // Nếu sử dụng phân trang phía server, bạn không cần phải dùng slice nữa.
    const displayedInvoices = filteredInvoices;

    const handlePrintInvoice = (invoice) => {
        setSelectedInvoice(invoice);
        setOpenDetail(true);
    };

    const handleOpenDetail = (invoice) => {
        setSelectedInvoice(invoice);
        setOpenDetail(true);
    };

    const handleCloseDetail = () => {
        setOpenDetail(false);
        setSelectedInvoice(null);
    };

    // Hàm xuất PDF dựa trên nội dung hiển thị trong Dialog
    const handleExportPDF = () => {
        if (!printRef.current) return;
        const scale = 2;
        html2canvas(printRef.current, { scale: scale }).then((canvas) => {
            const effectiveWidth = canvas.width / scale;
            const effectiveHeight = canvas.height / scale;
            const mmWidth = effectiveWidth * 0.264583;
            const mmHeight = effectiveHeight * 0.264583;
            const pdf = new jsPDF({
                orientation: mmWidth > mmHeight ? "l" : "p",
                unit: "mm",
                format: [mmWidth, mmHeight],
            });
            const imgData = canvas.toDataURL("image/png");
            pdf.addImage(imgData, "PNG", 0, 0, mmWidth, mmHeight);
            pdf.save(`invoice_${selectedInvoice?.codeInvoice || "invoice"}.pdf`);
        });
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
            <Typography variant="h4" align="center" gutterBottom>
                Danh Sách Hóa Đơn
            </Typography>

            {/* Ô tìm kiếm */}
            <Box display="flex" justifyContent="flex-end" mb={3}>
                <TextField
                    label="Tìm theo người tạo"
                    variant="outlined"
                    size="small"
                    value={searchCreator}
                    onChange={(e) => {
                        setSearchCreator(e.target.value);
                        // Khi tìm kiếm, reset trang về 0 để tránh trường hợp trang hiện tại không có dữ liệu
                        setPage(0);
                    }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton sx={{ color: "#E7B45A" }}>
                                    <SearchIcon />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>

            <TableContainer
                component={Paper}
                elevation={3}
                sx={{ maxWidth: "100%", margin: "auto" }}
            >
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
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {displayedInvoices.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center">
                                    Không tìm thấy hóa đơn nào
                                </TableCell>
                            </TableRow>
                        ) : (
                            displayedInvoices.map((invoice, index) => (
                                <TableRow
                                    key={invoice.id}
                                    sx={{
                                        backgroundColor:
                                            index % 2 === 0 ? "action.hover" : "background.paper",
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
                                    <TableCell align="center">
                                        {formatter.format(invoice.totalAmount)}
                                    </TableCell>
                                    <TableCell align="center">
                                        {invoice.user && invoice.user.fullName
                                            ? invoice.user.fullName
                                            : "N/A"}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title="In Hóa Đơn Giấy">
                                            <IconButton
                                                color="primary"
                                                onClick={() => handlePrintInvoice(invoice)}
                                            >
                                                <PrintIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pagination */}
            {totalPages > 1 && (
                <Box display="flex" justifyContent="center" mt={2}>
                    <Pagination
                        count={totalPages}
                        page={page + 1}
                        onChange={(event, value) => setPage(value - 1)}
                        color="primary"
                    />
                </Box>
            )}

            {/* Dialog chi tiết hóa đơn */}
            <Dialog open={openDetail} onClose={handleCloseDetail} fullWidth maxWidth="sm">
                <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
                    HÓA ĐƠN
                </DialogTitle>
                <DialogContent dividers ref={printRef}>
                    {selectedInvoice && (
                        <Box>
                            <Box sx={{ textAlign: "center", mb: 2 }}>
                                <Typography variant="h6" fontWeight="bold">
                                    Dana Coffee
                                </Typography>
                                <Typography variant="body2">
                                    Địa chỉ: Số 123, Đường ABC, Quận 1, TP.HCM
                                </Typography>
                                <Typography variant="body2">SĐT: 0123 456 789</Typography>
                            </Box>
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
                    <Button onClick={handleExportPDF} variant="contained" color="primary">
                        Xuất PDF
                    </Button>
                    <Button onClick={handleCloseDetail} color="primary">
                        Đóng
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default InvoiceComponent;
