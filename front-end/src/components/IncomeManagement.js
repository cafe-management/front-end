import React, { useState, useEffect } from "react";
import { getAllInvoice } from "../service/InvoiceService";
import {
    Card,
    CardContent,
    Typography,
    Grid,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
} from "@mui/material";
import HeaderAdmin from "../component/admin/HeaderAdmin";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

const IncomeManagement = () => {
    const [invoices, setInvoices] = useState([]);
    // selectedRange: "day" hoặc "month"
    const [selectedRange, setSelectedRange] = useState("day");
    const [totals, setTotals] = useState({
        overall: 0,
        today: 0,
        month: 0,
        year: 0,
    });

    // State cho lựa chọn ngày và tháng để so sánh
    const [selectedDay, setSelectedDay] = useState(""); // format: YYYY-MM-DD
    const [comparisonDay, setComparisonDay] = useState(""); // format: YYYY-MM-DD
    const [selectedMonth, setSelectedMonth] = useState(""); // format: YYYY-MM
    const [comparisonMonth, setComparisonMonth] = useState(""); // format: YYYY-MM

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                // Lấy tất cả hóa đơn; tăng size nếu cần dữ liệu đầy đủ cho biểu đồ
                const data = await getAllInvoice(0, 100);
                setInvoices(data.content);
                calculateTotals(data.content);
            } catch (error) {
                console.error("Error fetching invoice data: ", error);
            }
        };

        fetchInvoices();
    }, []);

    const calculateTotals = (invoices) => {
        let overall = 0,
            today = 0,
            month = 0,
            year = 0;
        const now = new Date();

        invoices.forEach((invoice) => {
            overall += invoice.totalAmount;
            const invoiceDate = new Date(invoice.datePayment);

            // Doanh thu hôm nay
            if (invoiceDate.toDateString() === now.toDateString()) {
                today += invoice.totalAmount;
            }
            // Doanh thu tháng này (cùng tháng, năm)
            if (
                invoiceDate.getMonth() === now.getMonth() &&
                invoiceDate.getFullYear() === now.getFullYear()
            ) {
                month += invoice.totalAmount;
            }
            // Doanh thu năm này
            if (invoiceDate.getFullYear() === now.getFullYear()) {
                year += invoice.totalAmount;
            }
        });

        setTotals({ overall, today, month, year });
    };

    // Hàm định dạng ngày sang YYYY-MM-DD
    const formatDate = (date) => date.toISOString().split("T")[0];

    // Hàm định dạng tháng sang YYYY-MM
    const formatMonth = (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        return `${year}-${month}`;
    };

    // Hàm tạo dữ liệu cho biểu đồ so sánh dựa vào lựa chọn (ngày hoặc tháng)
    const getChartDataComparison = () => {
        let labels = [];
        let currentData = [];
        let previousData = [];

        if (selectedRange === "day") {
            // Nếu chưa chọn ngày, sử dụng ngày hiện tại và ngày hôm qua làm mặc định
            const targetDateStr = selectedDay || formatDate(new Date());
            const compDateStr =
                comparisonDay || formatDate(new Date(new Date().setDate(new Date().getDate() - 1)));
            const targetDate = new Date(targetDateStr);
            const compDate = new Date(compDateStr);
            // Nhóm theo giờ: 0 - 23
            labels = Array.from({ length: 24 }, (_, i) => `${i}:00`);
            currentData = new Array(24).fill(0);
            previousData = new Array(24).fill(0);

            invoices.forEach((invoice) => {
                const invoiceDate = new Date(invoice.datePayment);
                if (invoiceDate.toDateString() === targetDate.toDateString()) {
                    const hour = invoiceDate.getHours();
                    currentData[hour] += invoice.totalAmount;
                }
                if (invoiceDate.toDateString() === compDate.toDateString()) {
                    const hour = invoiceDate.getHours();
                    previousData[hour] += invoice.totalAmount;
                }
            });
        } else if (selectedRange === "month") {
            // Nếu chưa chọn tháng, sử dụng tháng hiện tại và tháng trước làm mặc định
            const targetMonthStr = selectedMonth || formatMonth(new Date());
            const compMonthStr =
                comparisonMonth ||
                formatMonth(new Date(new Date().setMonth(new Date().getMonth() - 1)));
            const [targetYear, targetMonth] = targetMonthStr.split("-").map(Number);
            const [compYear, compMonth] = compMonthStr.split("-").map(Number);
            // Tính số ngày trong tháng mục tiêu
            const daysInTarget = new Date(targetYear, targetMonth, 0).getDate();
            // Sử dụng số ngày của tháng mục tiêu làm labels
            labels = Array.from({ length: daysInTarget }, (_, i) => `${i + 1}`);
            currentData = new Array(daysInTarget).fill(0);
            previousData = new Array(daysInTarget).fill(0);

            invoices.forEach((invoice) => {
                const invoiceDate = new Date(invoice.datePayment);
                // Nếu thuộc tháng mục tiêu
                if (
                    invoiceDate.getFullYear() === targetYear &&
                    invoiceDate.getMonth() + 1 === targetMonth
                ) {
                    const day = invoiceDate.getDate();
                    currentData[day - 1] += invoice.totalAmount;
                }
                // Nếu thuộc tháng so sánh
                if (
                    invoiceDate.getFullYear() === compYear &&
                    invoiceDate.getMonth() + 1 === compMonth
                ) {
                    const day = invoiceDate.getDate();
                    if (day - 1 < previousData.length) {
                        previousData[day - 1] += invoice.totalAmount;
                    }
                }
            });
        }

        return {
            labels,
            datasets: [
                {
                    label: "Kỳ hiện tại",
                    data: currentData,
                    backgroundColor: "rgba(75, 192, 192, 0.6)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1,
                },
                {
                    label: "Kỳ so sánh",
                    data: previousData,
                    backgroundColor: "rgba(255, 99, 132, 0.6)",
                    borderColor: "rgba(255, 99, 132, 1)",
                    borderWidth: 1,
                },
            ],
        };
    };

    const chartData = getChartDataComparison();
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: (value) => value.toLocaleString(),
                },
            },
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || "";
                        if (label) label += ": ";
                        if (context.parsed.y !== null) {
                            label += context.parsed.y.toLocaleString();
                        }
                        return label;
                    },
                },
            },
        },
    };

    return (
        <>
            <HeaderAdmin />
            <Box sx={{ mt: 8, p: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'black', textAlign: 'center' }}>
                    Quản Lý Doanh Thu
                </Typography>
                <Grid container spacing={2} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">Tổng danh thu</Typography>
                                <Typography variant="h5">
                                    {totals.overall.toLocaleString()} vnđ
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">Doanh thu hôm nay</Typography>
                                <Typography variant="h5">
                                    {totals.today.toLocaleString()} vnđ
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">Doanh thu tháng này</Typography>
                                <Typography variant="h5">
                                    {totals.month.toLocaleString()} vnđ
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">Doanh thu năm này</Typography>
                                <Typography variant="h5">
                                    {totals.year.toLocaleString()} vnđ
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Box chứa Select và các trường date/month trên cùng một hàng */}
                <Box
                    sx={{
                        mb: 4,
                        display: "flex",
                        gap: 2,
                        alignItems: "center",
                        flexWrap: "wrap", // Nếu màn hình nhỏ, các trường sẽ xuống hàng
                    }}
                >
                    {/* Dropdown để chọn kiểu so sánh: Ngày hoặc Tháng */}
                    <FormControl sx={{ minWidth: 150 }}>
                        <InputLabel id="compare-range-label">So sánh theo</InputLabel>
                        <Select
                            labelId="compare-range-label"
                            value={selectedRange}
                            label="So sánh theo"
                            onChange={(e) => setSelectedRange(e.target.value)}
                        >
                            <MenuItem value="day">Ngày</MenuItem>
                            <MenuItem value="month">Tháng</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Nếu chọn "Ngày", hiển thị 2 trường chọn ngày */}
                    {selectedRange === "day" && (
                        <>
                            <TextField
                                label="Ngày mục tiêu"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                value={selectedDay}
                                onChange={(e) => setSelectedDay(e.target.value)}
                            />
                            <TextField
                                label="Ngày so sánh"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                value={comparisonDay}
                                onChange={(e) => setComparisonDay(e.target.value)}
                            />
                        </>
                    )}

                    {/* Nếu chọn "Tháng", hiển thị 2 trường chọn tháng */}
                    {selectedRange === "month" && (
                        <>
                            <TextField
                                label="Tháng mục tiêu"
                                type="month"
                                InputLabelProps={{ shrink: true }}
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                            />
                            <TextField
                                label="Tháng so sánh"
                                type="month"
                                InputLabelProps={{ shrink: true }}
                                value={comparisonMonth}
                                onChange={(e) => setComparisonMonth(e.target.value)}
                            />
                        </>
                    )}
                </Box>

                {/* Biểu đồ so sánh doanh thu theo khoảng được chọn (chiều cao 300px) */}
                <Box sx={{ height: 300 }}>
                    <Bar data={chartData} options={chartOptions} />
                </Box>
            </Box>
        </>
    );
};

export default IncomeManagement;
