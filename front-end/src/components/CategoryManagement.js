import React, { useState, useEffect } from "react";
import {
    Container,
    Typography,
    Table,
    TableContainer,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    Button,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import HeaderAdmin from "../component/admin/HeaderAdmin";
import { getCategories, deleteCategory } from "../service/CategoryService";

const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deleteCategoryId, setDeleteCategoryId] = useState(null);
    const navigate = useNavigate();
    const role = localStorage.getItem("role");

    // Kiểm tra phân quyền: chỉ admin được truy cập
    useEffect(() => {
        if (role !== "admin") {
            toast.error("Bạn không có quyền truy cập trang này!");
            navigate("/login");
        }
    }, [role, navigate]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const handleDeleteCategory = async () => {
        try {
            await deleteCategory(deleteCategoryId);
            setCategories((prev) => prev.filter((cat) => cat.id !== deleteCategoryId));
            toast.success("Xóa danh mục thành công!");
            setOpenDeleteDialog(false);
        } catch (error) {
            toast.error("Lỗi khi xóa danh mục!");
        }
    };

    const handleOpenDeleteDialog = (id) => {
        setDeleteCategoryId(id);
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setDeleteCategoryId(null);
    };

    return (
        <>
            <HeaderAdmin />
            <Container maxWidth="lg" sx={{ mt: 4, pt: 4 }}>
                <Grid container alignItems="center" justifyContent="center" sx={{ my: 2 }}>
                    <Grid item>
                        <Typography
                            variant="h5"
                            sx={{ fontWeight: "bold", color: "black", textAlign: "center" }}
                        >
                            Danh Sách Danh Mục
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container justifyContent="flex-end" sx={{ my: 2 }}>
                    <Grid item>
                        <Button
                            variant="contained"
                            onClick={() => navigate("/category/create")}
                            sx={{
                                backgroundColor: "#E7B45A",
                                color: "black",
                                "&:hover": { backgroundColor: "#D1A750" },
                            }}
                        >
                            Thêm Danh Mục
                        </Button>
                    </Grid>
                </Grid>
                <TableContainer component={Paper} sx={{ mb: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Tên Danh Mục</TableCell>
                                <TableCell align="center">Hành Động</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {categories.length > 0 ? (
                                categories.map((category) => (
                                    <TableRow key={category.id}>
                                        <TableCell>{category.id}</TableCell>
                                        <TableCell>{category.nameCategory}</TableCell>
                                        <TableCell align="center">
                                            <Box display="flex" gap={1} justifyContent="center">
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => navigate(`/category/edit/${category.id}`)}
                                                >
                                                    Sửa
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    onClick={() => handleOpenDeleteDialog(category.id)}
                                                >
                                                    Xóa
                                                </Button>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3} align="center">
                                        Không có danh mục nào
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Dialog xác nhận xóa */}
                <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
                    <DialogTitle sx={{ fontWeight: "bold", color: "#f57c00" }}>
                        Xác nhận xóa
                    </DialogTitle>
                    <DialogContent>
                        <Typography>Bạn có chắc chắn muốn xóa danh mục này không?</Typography>
                    </DialogContent>
                    <DialogActions sx={{ justifyContent: "flex-end", gap: 2, px: 3, pb: 2 }}>
                        <Button
                            onClick={handleCloseDeleteDialog}
                            sx={{
                                backgroundColor: "#b0bec5",
                                color: "black",
                                "&:hover": { backgroundColor: "#90a4ae" },
                            }}
                        >
                            Hủy
                        </Button>
                        <Button onClick={handleDeleteCategory} color="error" variant="contained">
                            Xóa
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </>
    );
};

export default CategoryManagement;
