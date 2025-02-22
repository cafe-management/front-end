import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Container,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    IconButton
} from "@mui/material";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import {getAllEmploy, lockAccount} from "../../service/UserService"; // Assuming you've defined this in the UserService file
import HeaderAdmin from "./HeaderAdmin";
import EditIcon from "@mui/icons-material/Edit";

export default function EmployeeList() {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);  // Trang hiện tại
    const [totalPages, setTotalPages] = useState(1);
    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        console.log("Token:", token);
        console.log("Role:", role);

        if (!token) {
            console.warn("Không có token, điều hướng về trang đăng nhập.");
            navigate("/login");
            return;
        }
        if (role !== "admin") {
            console.warn("Người dùng không có quyền admin, điều hướng về trang không có quyền.");
            navigate("/login");
            return;
        }
        // Nếu có token và đúng role admin, mới gọi API
        fetchEmployees();
    }, [navigate]);
    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const data = await getAllEmploy();
            console.log("Fetched employees:", data); // Kiểm tra dữ liệu từ API
            if(data) {
                setEmployees(data.content);
            }
            // const activeEmployees = data.filter(employee => !employee.account?.isLocked);
            // setEmployees(activeEmployees);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách nhân viên:", error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchEmployees();
    }, []);
    const handleLockAccount = async (id) => {
        const confirmLock = window.confirm("Bạn có chắc chắn muốn khóa tài khoản này?");
        if (!confirmLock) return;

        const result = await lockAccount(id);
        if (result.success) {
            alert("Tài khoản đã bị khóa thành công.");
            setEmployees(prevEmployees => prevEmployees.filter(emp => emp.id !== id));
        } else {
            alert(result.message || "Có lỗi xảy ra khi khóa tài khoản.");
        }
    };
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
    };
    const handleEditEmployee = (employee) => {

        navigate(`/information`, { state: { employee } });
    };
    return (
        <>
            <Helmet>
                <title>Danh sách nhân viên</title>
            </Helmet>
            <HeaderAdmin/>
            <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "white" }}>
                <Container maxWidth="lg">
                    <Paper elevation={3} sx={{ padding: 4, borderRadius: 3, backgroundColor: "#fff" }}>
                        <Typography variant="h5" align="center" gutterBottom sx={{ color: "#000", fontWeight: "bold" }}>
                            Danh sách nhân viên
                        </Typography>
                        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
                            <Button
                                variant="contained"
                                sx={{
                                    backgroundColor: "#E7B45A",
                                    color: "#000",
                                    "&:hover": { backgroundColor: "#d09e4f" }
                                }}
                                onClick={() => navigate("/admin/register")}
                            >
                                Thêm nhân viên
                            </Button>
                        </Box>
                        {/* Table displaying employee data */}
                        <TableContainer>
                            <Table sx={{ minWidth: 650 }} aria-label="employee table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">Mã nhân viên</TableCell>
                                        <TableCell align="center">Tên đầy đủ</TableCell>
                                        <TableCell align="center">Tên tài khoản</TableCell>
                                        <TableCell align="center">Email</TableCell>
                                        <TableCell align="center">Số điện thoại</TableCell>
                                        <TableCell align="center">Lương</TableCell>
                                        <TableCell align="center">Vị trí</TableCell>
                                        <TableCell align="center"></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={8} align="center">Đang tải...</TableCell>
                                        </TableRow>
                                    ) : employees.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={8} align="center">Không có nhân viên nào.</TableCell>
                                        </TableRow>
                                    ) : (
                                        employees.map((employee) => (
                                            <TableRow key={employee.id}>
                                                <TableCell align="center">{employee.id}</TableCell>
                                                <TableCell align="center">{employee.fullName}</TableCell>
                                                <TableCell align="center">{employee.account ? employee.account.userName : 'N/A'}</TableCell>
                                                <TableCell align="center">{employee.email}</TableCell>
                                                <TableCell align="center">{employee.phoneNumber}</TableCell>
                                                <TableCell align="center">{employee.salary ? formatCurrency(employee.salary) : "N/A"}</TableCell>
                                                <TableCell align="center">{employee.account?.role?.nameRoles || "N/A"}</TableCell>
                                                <TableCell align="center">
                                                    <Button
                                                        variant="contained"
                                                        color={employee.account?.isLocked ? "error" : "secondary"}
                                                        disabled={employee.account?.isLocked}
                                                        onClick={() => handleLockAccount(employee.id)}
                                                    >
                                                        {employee.account?.isLocked ? "Đã khóa" : "Khóa"}
                                                    </Button>
                                                    <IconButton
                                                            color="primary"
                                                            onClick={() => handleEditEmployee(employee)}
                                                        >
                                                            <EditIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                            <IconButton
                                disabled={page === 0}
                                onClick={() => setPage(prev => Math.max(prev - 1, 0))}
                            >
                                <FirstPageIcon />
                            </IconButton>
                            <Typography sx={{ mx: 2, display: "flex", alignItems: "center" }}>
                                {page + 1} / {totalPages}
                            </Typography>
                            <IconButton
                                disabled={page >= totalPages - 1}
                                onClick={() => setPage(prev => Math.min(prev + 1, totalPages - 1))}
                            >
                                <LastPageIcon />
                            </IconButton>
                        </Box>
                    </Paper>
                </Container>
            </Box>
        </>
    );
}