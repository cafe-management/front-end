import React, { useEffect, useState } from "react";
import { Box, Button, Container, Paper, Typography,Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination } from "@mui/material";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { getAllEmploy } from "../../service/UserService"; // Assuming you've defined this in the UserService file
import { toast } from "react-toastify";
import HeaderAdmin from "./HeaderAdmin";

export default function EmployeeList() {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    useEffect(() => {
        const role = localStorage.getItem("role");
        if (role !== "admin") {
            navigate("/login"); // Chặn truy cập nếu không phải admin
        }
    }, [navigate]);
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const data = await getAllEmploy();
                setEmployees(data); // Set the employee data from API
            } catch (error) {
                console.error("Lỗi khi lấy danh sách nhân viên:", error);
                toast.error("Không thể tải danh sách nhân viên!");
            }
        };
        fetchEmployees();
    }, []);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
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
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {employees.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((employee) => (
                                        <TableRow key={employee.id}>
                                            <TableCell align="center">{employee.id}</TableCell>
                                            <TableCell align="center">{employee.fullName}</TableCell>
                                            <TableCell align="center">{employee.account ? employee.account.userName : 'N/A'}</TableCell> {/* Check if account exists */}
                                            <TableCell align="center">{employee.email}</TableCell>
                                            <TableCell align="center">{employee.phoneNumber}</TableCell> {/* Use phoneNumber directly */}
                                            <TableCell align="center">{employee.salary? formatCurrency(employee.salary): "N/A"}</TableCell>
                                            <TableCell align="center">{employee.account?.role?.nameRoles || "N/A"}</TableCell>

                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* Pagination */}
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={employees.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />

                        {/* Button to navigate to the "Register" page */}
                        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
                            <Button
                                variant="contained"
                                sx={{
                                    backgroundColor: "#E7B45A",
                                    color: "#000",
                                    "&:hover": { backgroundColor: "#d09e4f" }
                                }}
                                onClick={() => navigate("/admins/register")}
                            >
                                Thêm nhân viên
                            </Button>
                        </Box>
                    </Paper>
                </Container>
            </Box>
        </>
    );
}