import React, { useState, useEffect } from "react";
import {
    Container, Typography, CardMedia, Button, Box, Paper, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Pagination, Dialog, DialogActions, DialogContent, DialogTitle, TextField, List, ListItem, ListItemText, Select, MenuItem, InputLabel, FormControl
} from "@mui/material";
import { getDrinks, deleteDrink, updateDrink } from "../service/DrinkService";
import { getCloudinaryImageUrl, uploadImageToCloudinary } from "../service/CloudinaryService";
import { getCategories } from "../service/CategoryService";
import HeaderAdmin from "../component/admin/HeaderAdmin";


const DrinksManagement = () => {
    const [drinks, setDrinks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedDrink, setSelectedDrink] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deleteDrinkId, setDeleteDrinkId] = useState(null);

    const itemsPerPage = 10;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const drinkData = await getDrinks();
                setDrinks(drinkData);
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

    const filteredDrinks = selectedCategory === "All" ? drinks : drinks.filter(drink => drink.category.nameCategory === selectedCategory);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentDrinks = filteredDrinks.slice(indexOfFirstItem, indexOfLastItem);

    const handleChangePage = (event, value) => {
        setCurrentPage(value);
    };

    const handleDeleteDrink = async () => {
        try {
            await deleteDrink(deleteDrinkId);
            setDrinks(drinks.filter(drink => drink.id !== deleteDrinkId));
            setOpenDeleteDialog(false);
        } catch (error) {
            console.error("Error deleting drink:", error);
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

    const handleOpenDialog = (drink) => {
        setSelectedDrink(drink);
        setOpenDialog(true);
        setImageFile(null);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedDrink(null);
        setImageFile(null);
    };

    const handleUpdateDrink = async () => {
        try {
            if (imageFile) {
                const publicId = await uploadImageToCloudinary(imageFile);
                selectedDrink.imgDrinks = publicId;
            }

            await updateDrink(selectedDrink);
            setDrinks(drinks.map(drink => (drink.id === selectedDrink.id ? selectedDrink : drink)));
            handleCloseDialog();
        } catch (error) {
            console.error("Error updating drink:", error);
        }
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImageFile(file);
        }
    };

    return (
        <>
            <HeaderAdmin />
            <Container maxWidth="lg" sx={{ mt: 4, pt: 4 }}>
                <Grid container spacing={3} alignItems="stretch">
                    {/* Danh mục */}
                    <Grid item xs={12} sm={3} sx={{ display: "flex", flexDirection: "column" }}>
                        <Paper sx={{ p: 6, borderRadius: "10px", boxShadow: 10, height: "500px" }}>
                            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, textAlign: "center", color: "#C4975C" }}>
                                Danh Mục
                            </Typography>
                            <List>
                                {categories.map((category, index) => (
                                    <ListItem
                                        button
                                        key={index}
                                        selected={selectedCategory === category.nameCategory}
                                        onClick={() => handleCategoryChange(category.nameCategory)}
                                        sx={{
                                            py: 1,
                                            px: 2,
                                            borderRadius: "6px",
                                            "&.Mui-selected": {
                                                backgroundColor: "#C4975C",
                                                color: "white",
                                            },
                                            "&:hover": {
                                                backgroundColor: "#E3B778",
                                                color: "white",
                                            },
                                        }}
                                    >
                                        <ListItemText primary={category.nameCategory} sx={{ fontSize: "1rem" }} />
                                    </ListItem>
                                ))}
                            </List>
                        </Paper>
                    </Grid>

                    {/* Danh sách món ăn */}
                    <Grid item xs={12} sm={8}>
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: "bold",
                                color: "#C4975C",
                                mb: 3,
                                textAlign: "center",
                                width: "100%",
                                display: "block",
                                marginTop: "40px",
                            }}
                        >
                            Quản Lý Món Ăn
                        </Typography>

                        <TableContainer component={Paper} sx={{ maxHeight: "500px", overflowY: "auto" }}>
                            <Table aria-label="drinks table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Ảnh</TableCell>
                                        <TableCell>Tên Món</TableCell>
                                        <TableCell>Giá</TableCell>
                                        <TableCell>Hành Động</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {currentDrinks.length > 0 ? currentDrinks.map((drink) => (
                                        <TableRow key={drink.id}>
                                            <TableCell>
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
                                            <TableCell>{drink.price} VND</TableCell>
                                            <TableCell>
                                                <Box display="flex" gap={1}>
                                                    <Button
                                                        variant="contained"
                                                        color="warning"
                                                        size="small"
                                                        onClick={() => handleOpenDialog(drink)}
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
                                    )) : (
                                        <TableRow>
                                            <TableCell colSpan={4} align="center">
                                                <Typography variant="body1" sx={{ color: "#C4975C" }}>
                                                    Không có món nào
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Box display="flex" justifyContent="center" mt={2}>
                            <Pagination
                                count={Math.ceil(filteredDrinks.length / itemsPerPage)}
                                page={currentPage}
                                onChange={handleChangePage}
                                color="primary"
                                size="medium"
                            />
                        </Box>
                    </Grid>
                </Grid>


                <Dialog open={openDialog} onClose={handleCloseDialog}>
                    <DialogTitle>Chỉnh Sửa Món</DialogTitle>
                    <DialogContent>
                        {selectedDrink && (
                            <>
                                <Typography variant="body1" sx={{ mb: 2 }}>Ảnh Cũ:</Typography>
                                <CardMedia
                                    component="img"
                                    image={getCloudinaryImageUrl(selectedDrink.imgDrinks, { width: 100, height: 100, crop: "fit" })}
                                    alt={selectedDrink.nameDrinks}
                                    sx={{
                                        width: 100,
                                        height: 100,
                                        objectFit: "cover",
                                        borderRadius: "8px",
                                        border: "1px solid #C4975C",
                                        mb: 2
                                    }}
                                />

                                <TextField
                                    label="Tên Món"
                                    fullWidth
                                    value={selectedDrink.nameDrinks}
                                    onChange={(e) => setSelectedDrink({ ...selectedDrink, nameDrinks: e.target.value })}
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    label="Giá"
                                    fullWidth
                                    value={selectedDrink.price}
                                    onChange={(e) => setSelectedDrink({ ...selectedDrink, price: e.target.value })}
                                    sx={{ mb: 2 }}
                                />

                                <FormControl fullWidth sx={{ mb: 2 }}>
                                    <InputLabel>Loại Sản Phẩm</InputLabel>
                                    <Select
                                        value={selectedDrink.category ? selectedDrink.category.nameCategory : ""}
                                        onChange={(e) => {
                                            const selectedCategory = categories.find(cat => cat.nameCategory === e.target.value);
                                            setSelectedDrink({ ...selectedDrink, category: selectedCategory });
                                        }}
                                    >
                                        {categories.map((category, index) => (
                                            <MenuItem key={index} value={category.nameCategory}>
                                                {category.nameCategory}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                {imageFile && (
                                    <Typography variant="body1" sx={{ mb: 2 }}>Ảnh Mới:</Typography>
                                )}
                                {imageFile && (
                                    <CardMedia
                                        component="img"
                                        image={URL.createObjectURL(imageFile)}
                                        alt="New Image Preview"
                                        sx={{
                                            width: 100,
                                            height: 100,
                                            objectFit: "cover",
                                            borderRadius: "8px",
                                            border: "1px solid #C4975C",
                                            mb: 2
                                        }}
                                    />
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    style={{ display: "block", marginTop: "10px" }}
                                />
                            </>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog} color="primary">Hủy</Button>
                        <Button onClick={handleUpdateDrink} color="primary">Cập Nhật</Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
                    <DialogTitle>Chắc chắn muốn xóa?</DialogTitle>
                    <DialogContent>
                        <Typography variant="body1">Bạn có chắc chắn muốn xóa món này không?</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDeleteDialog} color="primary">Hủy</Button>
                        <Button onClick={handleDeleteDrink} color="error">Xóa</Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </>
    );
};

export default DrinksManagement;