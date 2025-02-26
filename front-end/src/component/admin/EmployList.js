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
    IconButton,
    Pagination,
    TextField,
    Dialog,
    DialogContent,
    DialogTitle,
    DialogActions,
    Grid
} from "@mui/material";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { getAllEmploy, lockAccount } from "../../service/UserService";
import HeaderAdmin from "./HeaderAdmin";
import SearchIcon from "@mui/icons-material/Search";
import { toast } from "react-toastify";

export default function EmployeeList() {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [searchValue, setSearchValue] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const itemsPerPage = 4;
    const [totalPages, setTotalPages] = useState(1);
    const [openLockDialog, setOpenLockDialog] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const handleSearch = () => {
        setSearchTerm(searchValue);
        // Reset trang về 0 khi tìm kiếm
        setCurrentPage(0);
        fetchEmployees(0, itemsPerPage, searchValue);
    };

    const handleChangePage = async (event, value) => {
        setCurrentPage(value - 1);
        await fetchEmployees(value - 1, itemsPerPage, searchTerm);
    };

    const fetchEmployees = async (page = 0, size = 4, search = "") => {
        setLoading(true);
        try {
            const data = await getAllEmploy(page, size, search);
            if (data) {
                setEmployees([...data.content]);
                setTotalPages(data.totalPages);
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh sách nhân viên:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        if (!token) {
            navigate("/login");
            return;
        }
        if (role !== "admin") {
            navigate("/login");
            return;
        }
        fetchEmployees(currentPage, itemsPerPage, searchTerm);
    }, [navigate]);

    const handleOpenLockDialog = (employee) => {
        setSelectedEmployee(employee);
        setOpenLockDialog(true);
    };

    const handleCloseLockDialog = () => {
        setOpenLockDialog(false);
        setSelectedEmployee(null);
    };

    const handleConfirmLockAccount = async () => {
        if (!selectedEmployee) return;
        try {
            const result = await lockAccount(selectedEmployee.id);
            if (result.success) {
                toast.success(`Tài khoản của ${selectedEmployee.fullName} đã bị khóa.`);
                await fetchEmployees(currentPage, itemsPerPage, searchTerm);
            } else {
                toast.error(result.message || "Có lỗi xảy ra khi khóa tài khoản.");
            }
        } catch (error) {
            toast.error("Lỗi khi gửi yêu cầu khóa tài khoản.");
        } finally {
            handleCloseLockDialog();
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
            <HeaderAdmin />
            <Container maxWidth="lg" sx={{ mt: 4, pt: 4 }}>
                <Grid container alignItems="center" justifyContent="center" sx={{ position: 'relative', my: 2 }}>
                    <Grid item>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'black', textAlign: 'center' }}>
                            Danh Sách Nhân Viên
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={6} md={4}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <TextField
                                fullWidth
                                label="Tìm kiếm theo tên/SĐT..."
                                variant="outlined"
                                size="small"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                            />
                            <IconButton onClick={handleSearch} sx={{ color: "#000" }}>
                                <SearchIcon />
                            </IconButton>
                        </Box>
                    </Grid>
                    <Grid item>
                        <Button
                            variant="contained"
                            onClick={() => navigate("/admin/register")}
                            sx={{
                                backgroundColor: "#E7B45A",
                                color: "#000",
                                "&:hover": { backgroundColor: "#D1A750" }
                            }}
                        >
                            Thêm nhân viên
                        </Button>
                    </Grid>
                </Grid>
                    <TableContainer component={Paper} sx={{ maxHeight: "600px", overflowY: "auto", border: "none" }}>
                        <Table aria-label="employee table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">Mã nhân viên</TableCell>
                                    <TableCell align="center">Tên đầy đủ</TableCell>
                                    <TableCell align="center">Tên tài khoản</TableCell>
                                    <TableCell align="center">Email</TableCell>
                                    <TableCell align="center">SĐT</TableCell>
                                    <TableCell align="center">Lương</TableCell>
                                    <TableCell align="center">Vị trí</TableCell>
                                    <TableCell align="center">Hành động</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={8} align="center">
                                            Đang tải...
                                        </TableCell>
                                    </TableRow>
                                ) : employees.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} align="center">
                                            Không có nhân viên nào.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    employees.map((employee) => (
                                        <TableRow key={employee.id}>
                                            <TableCell align="center">{employee.id}</TableCell>
                                            <TableCell align="center">{employee.fullName}</TableCell>
                                            <TableCell align="center">
                                                {employee.account ? employee.account.userName : "N/A"}
                                            </TableCell>
                                            <TableCell align="center">{employee.email}</TableCell>
                                            <TableCell align="center">{employee.phoneNumber}</TableCell>
                                            <TableCell align="center">
                                                {employee.salary ? formatCurrency(employee.salary) : "N/A"}
                                            </TableCell>
                                            <TableCell align="center">
                                                {employee.account?.role?.nameRoles || "N/A"}
                                            </TableCell>
                                            <TableCell align="center">
                                                <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                                                    <Button
                                                        variant="contained"
                                                        color="error"
                                                        disabled={employee.account?.isLocked}
                                                        onClick={() => handleOpenLockDialog(employee)}
                                                        sx={{
                                                            backgroundColor: employee.account?.isLocked ? "#d32f2f" : "#f44336",
                                                            "&:hover": {
                                                                backgroundColor: employee.account?.isLocked ? "#d32f2f" : "#c62828"
                                                            }
                                                        }}
                                                    >
                                                        {employee.account?.isLocked ? "Đã khóa" : "Khóa"}
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={() => handleEditEmployee(employee)}
                                                        sx={{
                                                            backgroundColor: "#1976d2",
                                                            "&:hover": { backgroundColor: "#1565c0" }
                                                        }}
                                                    >
                                                        Sửa
                                                    </Button>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box display="flex" justifyContent="center" mt={2}>
                        <Pagination
                            count={totalPages}
                            page={currentPage + 1}
                            onChange={handleChangePage}
                            color="primary"
                            size="medium"
                        />
                    </Box>
            </Container>

            <Dialog open={openLockDialog} onClose={handleCloseLockDialog}>
                <DialogTitle sx={{ fontWeight: "bold", color: "#f57c00" }}>
                    Xác nhận khóa tài khoản
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        Bạn có chắc chắn muốn khóa tài khoản của{" "}
                        <strong>{selectedEmployee?.fullName}</strong> không?
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ justifyContent: "flex-end", gap: 2, px: 3, pb: 2 }}>
                    <Button onClick={handleCloseLockDialog} sx={{ backgroundColor: "#b0bec5", color: "black", "&:hover": { backgroundColor: "#90a4ae" } }}>
                        Hủy
                    </Button>
                    <Button onClick={handleConfirmLockAccount} color="error" variant="contained">
                        Khóa
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
