import React, { useState, useEffect } from "react";
import {
    Container,
    Typography,
    CardMedia,
    Button,
    Box,
    Paper,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Pagination,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material";
import { getDrinks, deleteDrink } from "../service/DrinkService";
import { getCloudinaryImageUrl } from "../service/CloudinaryService";
import { getCategories } from "../service/CategoryService";
import HeaderAdmin from "../component/admin/HeaderAdmin";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const DrinksManagement = () => {
    const [drinks, setDrinks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deleteDrinkId, setDeleteDrinkId] = useState(null);
    const navigate = useNavigate();
    const itemsPerPage = 4;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const drinkData = await getDrinks();
                // Sắp xếp theo thứ tự giảm dần dựa trên id
                const sortedDrinks = drinkData.sort((a, b) => b.id - a.id);
                setDrinks(sortedDrinks);

                const categoryData = await getCategories();
                const allCategory = { id: 0, nameCategory: "All" };
                setCategories([allCategory, ...categoryData]);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        setCurrentPage(1);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    };

    const filteredDrinks =
        selectedCategory === "All"
            ? drinks
            : drinks.filter((drink) => drink.category.nameCategory === selectedCategory);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentDrinks = filteredDrinks.slice(indexOfFirstItem, indexOfLastItem);

    const handleChangePage = (event, value) => {
        setCurrentPage(value);
    };

    const handleDeleteDrink = async () => {
        try {
            await deleteDrink(deleteDrinkId);
            // Cập nhật lại danh sách drinks sau soft delete
            setDrinks((prevDrinks) => prevDrinks.filter((drink) => drink.id !== deleteDrinkId));
            setOpenDeleteDialog(false);
            toast.success("Xóa món ăn thành công!");
        } catch (error) {
            toast.error("Lỗi khi xóa món ăn!");
        }
    };

    const handleOpenDeleteDialog = (id) => {
        setDeleteDrinkId(id);
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setDeleteDrinkId(null);
    };

    return (
        <>
            <HeaderAdmin />
            <Container maxWidth="lg" sx={{ mt: 4, pt: 4 }}>
                <Grid container alignItems="center" justifyContent="center" sx={{ my: 2 }}>
                    <Grid item>
                        <Typography variant="h5" sx={{ fontWeight: "bold", color: "black", textAlign: "center" }}>
                            Danh Sách Đồ Uống
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container justifyContent="flex-end" sx={{ my: 2 }}>
                    <Grid item>
                        <Button
                            variant="contained"
                            onClick={() => navigate("/drink/create")}
                            sx={{
                                backgroundColor: "#E7B45A",
                                color: "black",
                                "&:hover": { backgroundColor: "#D1A750" },
                            }}
                        >
                            Thêm Món mới
                        </Button>
                    </Grid>
                </Grid>

                <TableContainer component={Paper} sx={{ maxHeight: "600px", overflowY: "auto", mb: 2 }}>
                    <Table aria-label="drinks table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Ảnh</TableCell>
                                <TableCell>Tên Món</TableCell>
                                <TableCell>Giá</TableCell>
                                <TableCell>Loại Món</TableCell>
                                <TableCell align="center">Hành Động</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {currentDrinks.length > 0 ? (
                                currentDrinks.map((drink) => (
                                    <TableRow key={drink.id}>
                                        <TableCell align="center">
                                            <CardMedia
                                                component="img"
                                                image={getCloudinaryImageUrl(drink.imgDrinks)}
                                                alt={drink.nameDrinks}
                                                sx={{
                                                    width: 70,
                                                    height: 70,
                                                    objectFit: "cover",
                                                    borderRadius: "8px",
                                                    border: "1px solid #C4975C",
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>{drink.nameDrinks}</TableCell>
                                        <TableCell>{formatPrice(drink.price)}</TableCell>
                                        <TableCell>{drink.category ? drink.category.nameCategory : "Chưa có loại"}</TableCell>
                                        <TableCell align="center">
                                            <Box display="flex" gap={1} justifyContent="center">
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    size="small"
                                                    onClick={() => navigate(`/drink/edit/${drink.id}`)}
                                                >
                                                    Sửa
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    size="small"
                                                    onClick={() => handleOpenDeleteDialog(drink.id)}
                                                >
                                                    Xóa
                                                </Button>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        <Typography variant="body1" sx={{ color: "#C4975C" }}>
                                            Không có món nào
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Box display="flex" justifyContent="center" mb={3}>
                    <Pagination
                        count={Math.ceil(filteredDrinks.length / itemsPerPage)}
                        page={currentPage}
                        onChange={handleChangePage}
                        color="primary"
                        size="medium"
                    />
                </Box>
            </Container>

            {/* Dialog xác nhận xóa */}
            <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
                <DialogTitle sx={{ fontWeight: "bold", color: "#f57c00" }}>Xác nhận xóa</DialogTitle>
                <DialogContent>
                    <Typography>
                        Bạn có chắc chắn muốn xóa món ăn{" "}
                        <strong>{drinks.find((drink) => drink.id === deleteDrinkId)?.nameDrinks}</strong> không?
                    </Typography>
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
                    <Button onClick={handleDeleteDrink} color="error" variant="contained">
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default DrinksManagement;
