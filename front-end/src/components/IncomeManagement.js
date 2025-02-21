import React, { useEffect, useState } from "react";
import { getAllInvoice } from "../service/InvoiceService";
import {
    Container,
    Typography,
    Box,
    Alert,
    Card,
    CardContent,
    Grid,
    ToggleButton,
    ToggleButtonGroup,
    Grow,
} from "@mui/material";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import HeaderAdmin from "../component/admin/HeaderAdmin";

// Đăng ký các thành phần của ChartJS
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const IncomeManagement = () => {
    const [invoices, setInvoices] = useState([]);
    const [error, setError] = useState(null);
    const [timeFrame, setTimeFrame] = useState("week");
    const [revenueByDay, setRevenueByDay] = useState(0);
    const [revenueByWeek, setRevenueByWeek] = useState(0);
    const [revenueByMonth, setRevenueByMonth] = useState(0);
    const [revenueByYear, setRevenueByYear] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);

    const currencyFormatter = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    });

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const data = await getAllInvoice();
                setInvoices(data);
                let dayTotal = 0,
                    weekTotal = 0,
                    monthTotal = 0,
                    yearTotal = 0,
                    total = 0;
                const now = new Date();
                const todayStr = now.toDateString();
                const weekStart = new Date(now);
                weekStart.setDate(now.getDate() - now.getDay());
                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekStart.getDate() + 6);

                data.forEach((invoice) => {
                    const invoiceDate = new Date(invoice.dateCreate);
                    const amount = parseFloat(invoice.totalAmount) || 0;
                    total += amount;
                    if (invoiceDate.toDateString() === todayStr) {
                        dayTotal += amount;
                    }
                    if (invoiceDate >= weekStart && invoiceDate <= weekEnd) {
                        weekTotal += amount;
                    }
                    if (
                        invoiceDate.getMonth() === now.getMonth() &&
                        invoiceDate.getFullYear() === now.getFullYear()
                    ) {
                        monthTotal += amount;
                    }
                    if (invoiceDate.getFullYear() === now.getFullYear()) {
                        yearTotal += amount;
                    }
                });
                setRevenueByDay(dayTotal);
                setRevenueByWeek(weekTotal);
                setRevenueByMonth(monthTotal);
                setRevenueByYear(yearTotal);
                setTotalRevenue(total);
            } catch (err) {
                console.error("Lỗi khi lấy dữ liệu hóa đơn:", err);
                setError(err);
            }
        };

        fetchInvoices();
    }, []);

    // Hàm tổng hợp dữ liệu cho biểu đồ cột
    const getChartData = (timeFrame) => {
        const now = new Date();
        let labels = [];
        let dataPoints = [];
        if (timeFrame === "day") {
            labels = Array.from({ length: 24 }, (_, i) => `${i}:00`);
            dataPoints = Array(24).fill(0);
            invoices.forEach((invoice) => {
                const invoiceDate = new Date(invoice.dateCreate);
                if (invoiceDate.toDateString() === now.toDateString()) {
                    const hour = invoiceDate.getHours();
                    dataPoints[hour] += parseFloat(invoice.totalAmount) || 0;
                }
            });
        } else if (timeFrame === "week") {
            const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
            labels = days;
            dataPoints = Array(7).fill(0);
            const weekStart = new Date(now);
            weekStart.setDate(now.getDate() - now.getDay());
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);
            invoices.forEach((invoice) => {
                const invoiceDate = new Date(invoice.dateCreate);
                if (invoiceDate >= weekStart && invoiceDate <= weekEnd) {
                    const dayIndex = invoiceDate.getDay();
                    dataPoints[dayIndex] += parseFloat(invoice.totalAmount) || 0;
                }
            });
        } else if (timeFrame === "month") {
            const year = now.getFullYear();
            const month = now.getMonth();
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            labels = Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`);
            dataPoints = Array(daysInMonth).fill(0);
            invoices.forEach((invoice) => {
                const invoiceDate = new Date(invoice.dateCreate);
                if (
                    invoiceDate.getMonth() === month &&
                    invoiceDate.getFullYear() === year
                ) {
                    const day = invoiceDate.getDate();
                    dataPoints[day - 1] += parseFloat(invoice.totalAmount) || 0;
                }
            });
        } else if (timeFrame === "year") {
            const monthNames = [
                "Tháng 1",
                "Tháng 2",
                "Tháng 3",
                "Tháng 4",
                "Tháng 5",
                "Tháng 6",
                "Tháng 7",
                "Tháng 8",
                "Tháng 9",
                "Tháng 10",
                "Tháng 11",
                "Tháng 12",
            ];
            labels = monthNames;
            dataPoints = Array(12).fill(0);
            const year = now.getFullYear();
            invoices.forEach((invoice) => {
                const invoiceDate = new Date(invoice.dateCreate);
                if (invoiceDate.getFullYear() === year) {
                    const m = invoiceDate.getMonth();
                    dataPoints[m] += parseFloat(invoice.totalAmount) || 0;
                }
            });
        }
        return {
            labels,
            datasets: [
                {
                    label: "Doanh thu",
                    data: dataPoints,
                    backgroundColor: dataPoints.map(
                        () => "#" + Math.floor(Math.random() * 16777215).toString(16)
                    ),
                },
            ],
        };
    };

    const chartData = getChartData(timeFrame);

    const barOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: true,
                text: `Biểu đồ doanh thu theo ${timeFrame}`,
            },
        },
    };

    const handleTimeFrameChange = (event, newTimeFrame) => {
        if (newTimeFrame !== null) {
            setTimeFrame(newTimeFrame);
        }
    };

    return (
        <>
            <HeaderAdmin />
            <Container maxWidth="lg" sx={{ mt: "80px" }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Quản Lý Doanh Thu
                </Typography>
                {error ? (
                    <Alert severity="error">Lỗi: {error.message}</Alert>
                ) : (
                    <Box sx={{ mt: 2 }}>
                        <Grid container spacing={4}>
                            {/* Các Card hiển thị tổng doanh thu */}
                            <Grid item xs={12} md={4}>
                                <Grid container spacing={2} direction="column">
                                    <Grow in timeout={400}>
                                        <Grid item>
                                            <Card
                                                sx={{
                                                    transition: "transform 0.3s",
                                                    "&:hover": { transform: "scale(1.03)" },
                                                }}
                                            >
                                                <CardContent>
                                                    <Typography variant="h6" align="center">
                                                        Tổng Doanh Thu
                                                    </Typography>
                                                    <Typography variant="body1" align="center">
                                                        {currencyFormatter.format(totalRevenue)}
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    </Grow>
                                    <Grow in timeout={500}>
                                        <Grid item>
                                            <Card
                                                sx={{
                                                    transition: "transform 0.3s",
                                                    "&:hover": { transform: "scale(1.03)" },
                                                }}
                                            >
                                                <CardContent>
                                                    <Typography variant="h6" align="center">
                                                        Hôm Nay
                                                    </Typography>
                                                    <Typography variant="body1" align="center">
                                                        {currencyFormatter.format(revenueByDay)}
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    </Grow>
                                    <Grow in timeout={600}>
                                        <Grid item>
                                            <Card
                                                sx={{
                                                    transition: "transform 0.3s",
                                                    "&:hover": { transform: "scale(1.03)" },
                                                }}
                                            >
                                                <CardContent>
                                                    <Typography variant="h6" align="center">
                                                        Tuần Này
                                                    </Typography>
                                                    <Typography variant="body1" align="center">
                                                        {currencyFormatter.format(revenueByWeek)}
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    </Grow>
                                    <Grow in timeout={700}>
                                        <Grid item>
                                            <Card
                                                sx={{
                                                    transition: "transform 0.3s",
                                                    "&:hover": { transform: "scale(1.03)" },
                                                }}
                                            >
                                                <CardContent>
                                                    <Typography variant="h6" align="center">
                                                        Tháng Này
                                                    </Typography>
                                                    <Typography variant="body1" align="center">
                                                        {currencyFormatter.format(revenueByMonth)}
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    </Grow>
                                    <Grow in timeout={800}>
                                        <Grid item>
                                            <Card
                                                sx={{
                                                    transition: "transform 0.3s",
                                                    "&:hover": { transform: "scale(1.03)" },
                                                }}
                                            >
                                                <CardContent>
                                                    <Typography variant="h6" align="center">
                                                        Năm Này
                                                    </Typography>
                                                    <Typography variant="body1" align="center">
                                                        {currencyFormatter.format(revenueByYear)}
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    </Grow>
                                </Grid>
                            </Grid>

                            {/* Cột chứa biểu đồ và toggle chọn thời gian */}
                            <Grid item xs={12} md={8}>
                                <Box sx={{ mb: 2, textAlign: "center" }}>
                                    <ToggleButtonGroup
                                        value={timeFrame}
                                        exclusive
                                        onChange={handleTimeFrameChange}
                                        aria-label="time frame"
                                    >
                                        <ToggleButton value="day" aria-label="day">
                                            Ngày
                                        </ToggleButton>
                                        <ToggleButton value="week" aria-label="week">
                                            Tuần
                                        </ToggleButton>
                                        <ToggleButton value="month" aria-label="month">
                                            Tháng
                                        </ToggleButton>
                                        <ToggleButton value="year" aria-label="year">
                                            Năm
                                        </ToggleButton>
                                    </ToggleButtonGroup>
                                </Box>
                                <Box>
                                    <Bar data={chartData} options={barOptions} />
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                )}
            </Container>
        </>
    );
};

export default IncomeManagement;
