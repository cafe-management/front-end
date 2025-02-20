import React, { useEffect, useState } from "react";
import { getAllInvoice } from "../service/InvoiceService";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    CircularProgress,
    Box
} from "@mui/material";

const InvoiceComponent = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Formatter tiền VND
    const formatter = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND"
    });

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

    if (loading) {
        return (
            <Box display="flex" alignItems="center" justifyContent="center" minHeight="200px">
                <CircularProgress />
                <Typography variant="h6" sx={{ ml: 2 }}>
                    Đang tải hóa đơn...
                </Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Typography color="error" variant="h6">
                Lỗi khi lấy hóa đơn: {error.message}
            </Typography>
        );
    }

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Danh Sách Hóa Đơn
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    {/* Header của bảng luôn xuất hiện */}
                    <TableHead>
                        <TableRow>
                            <TableCell>Mã Hóa Đơn</TableCell>
                            <TableCell>Ngày Tạo</TableCell>
                            <TableCell>Ngày Thanh Toán</TableCell>
                            <TableCell>Trạng Thái</TableCell>
                            <TableCell>Tổng Tiền</TableCell>
                            <TableCell>Người Tạo</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {invoices.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    Không tìm thấy hóa đơn nào
                                </TableCell>
                            </TableRow>
                        ) : (
                            invoices.map((invoice) => (
                                <TableRow key={invoice.id}>
                                    <TableCell>{invoice.codeInvoice}</TableCell>
                                    <TableCell>{new Date(invoice.dateCreate).toLocaleString()}</TableCell>
                                    <TableCell>
                                        {invoice.datePayment
                                            ? new Date(invoice.datePayment).toLocaleString()
                                            : "N/A"}
                                    </TableCell>
                                    <TableCell>
                                        {invoice.statusOrder ? "Đã hoàn thành" : "Chưa hoàn thành"}
                                    </TableCell>
                                    <TableCell>{formatter.format(invoice.totalAmount)}</TableCell>
                                    <TableCell>
                                        {invoice.user.fullName ? invoice.user.fullName : "N/A"}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default InvoiceComponent;
