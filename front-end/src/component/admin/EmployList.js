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
    TextField
} from "@mui/material";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { getAllEmploy } from "../../service/UserService"; // Ensure this imports the updated function
import { toast } from "react-toastify";
import HeaderAdmin from "../auth/HeaderAdmin";

export default function EmployeeList() {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalCount, setTotalCount] = useState(0); // To track the total number of records

    // Fetch employee data based on filter, page, and rowsPerPage
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const data = await getAllEmploy(page, rowsPerPage);
                setEmployees(data.content); // Assuming the response has a 'content' field for employees
                setTotalCount(data.totalElements); // Assuming the response has a 'totalElements' field for total count
            } catch (error) {
                console.error("Lỗi khi lấy danh sách nhân viên:", error);
                toast.error("Không thể tải danh sách nhân viên!");
            }
        };
        fetchEmployees();
    }, [page, rowsPerPage]); // Re-run fetch on these dependencies

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 5));
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
            <HeaderAdmin />
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
                                    {(Array.isArray(employees) ? employees : []).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((employee) => (
                                        <TableRow key={employee.id}>
                                            <TableCell align="center">{employee.id}</TableCell>
                                            <TableCell align="center">{employee.fullName}</TableCell>
                                            <TableCell align="center">{employee.account?.userName || 'N/A'}</TableCell>
                                            <TableCell align="center">{employee.email}</TableCell>
                                            <TableCell align="center">{employee.phoneNumber}</TableCell>
                                            <TableCell align="center">{employee.salary ? formatCurrency(employee.salary) : "N/A"}</TableCell>
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
                            count={totalCount}
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
        </>
    );
}
