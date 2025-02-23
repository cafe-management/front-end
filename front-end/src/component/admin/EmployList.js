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
    IconButton, Pagination, TextField, Dialog, DialogContent, DialogTitle, DialogActions
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import {getAllEmploy, lockAccount} from "../../service/UserService"; // Assuming you've defined this in the UserService file
import HeaderAdmin from "./HeaderAdmin";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import {toast} from "react-toastify";

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
        setSearchTerm(searchValue); // Cập nhật searchTerm để kích hoạt useEffect gọi API
    };

    const handleChangePage = async (event, value) => {
        console.log(`Chuyển trang từ ${currentPage} -> ${value - 1}`);
        setCurrentPage(value - 1);  // Lưu trạng thái đúng với backend (0-based)
        await fetchEmployees(value - 1, itemsPerPage, searchTerm);
    };

    const reloadEmployees = async () => {
        const data = await getAllEmploy();
        setEmployees(data.content);
    };
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

        // Nếu có token và đúng role admin, gọi API lấy danh sách nhân viên
    }, [navigate]);
    const fetchEmployees = async (page = 0, size = 4, search = "") => {
        setLoading(true);
        console.log("Current Page State:", currentPage);
        try {
            console.log(`Gọi API với page = ${page}, size = ${size}, search = ${search}`);
            const data = await getAllEmploy(page, size, search);

            if (data) {
                console.log("Dữ liệu nhận từ API:", data);
                setEmployees([...data.content]);  // Thêm `[...data.content]` để React re-render
                setTotalPages(data.totalPages);
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh sách nhân viên:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees(currentPage, itemsPerPage, searchTerm);
    }, [currentPage, searchTerm]);
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

        console.log("Đang khóa tài khoản ID:", selectedEmployee.id);

        try {
            const result = await lockAccount(selectedEmployee.id);
            if (result.success) {
                toast.success(`Tài khoản của ${selectedEmployee.fullName} đã bị khóa.`);
                await fetchEmployees(); // Cập nhật danh sách ngay lập tức
            } else {
                toast.error(result.message || "Có lỗi xảy ra khi khóa tài khoản.");
            }
        } catch (error) {
            toast.error("Lỗi khi gửi yêu cầu khóa tài khoản.");
        } finally {
            handleCloseLockDialog();
        }
    };
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
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
            <Box mt={10} sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "white" }}>
                <Container maxWidth="lg">
                    <Paper elevation={3} sx={{ padding: 4, borderRadius: 3, backgroundColor: "#fff" }}>
                        <Typography variant="h5" align="center" gutterBottom sx={{ color: "#000", fontWeight: "bold" }} >
                            Danh sách nhân viên
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <TextField
                                label="Tìm kiếm theo tên/SĐT..."
                                variant="outlined"
                                size="small"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                            />
                            <IconButton sx={{ color: "#000" }}  onClick={handleSearch}>
                                <SearchIcon />
                            </IconButton>
                        </Box>
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
                        <TableContainer key={currentPage}>
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
                                                    <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
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
                                                                "&:hover": {
                                                                    backgroundColor: "#1565c0"
                                                                }
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
                                count={totalPages} // Sử dụng tổng số trang từ API
                                page={currentPage + 1}
                                onChange={handleChangePage}
                                color="primary"
                                size="medium"
                            />
                        </Box>
                    </Paper>
                </Container>
                <Dialog open={openLockDialog} onClose={handleCloseLockDialog}>
                    <DialogTitle>Xác nhận khóa tài khoản</DialogTitle>
                    <DialogContent>
                        <Typography variant="body1">
                            Bạn có chắc chắn muốn khóa tài khoản của <strong>{selectedEmployee?.fullName}</strong> không?
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseLockDialog} color="primary">Hủy</Button>
                        <Button onClick={handleConfirmLockAccount} color="error">Khóa</Button>
                    </DialogActions>
                </Dialog>

            </Box>
        </>
    );
}