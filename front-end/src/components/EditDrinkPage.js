import React, { useState, useEffect } from "react";
import {
    Container,
    Typography,
    TextField,
    CardMedia,
    Button,
    Box,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Paper,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Helmet } from "react-helmet-async";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { getDrinks, updateDrink } from "../service/DrinkService";
import { getCloudinaryImageUrl, uploadImageToCloudinary } from "../service/CloudinaryService";
import { getCategories } from "../service/CategoryService";
import HeaderAdmin from "../component/admin/HeaderAdmin";
import { NumericFormat } from "react-number-format";

const primaryColor = "#E7B45A";

const EditDrinkPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [drink, setDrink] = useState(null);
    const [categories, setCategories] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [updating, setUpdating] = useState(false); // State cho loading khi cập nhật

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Lấy danh sách món ăn và tìm món có id tương ứng
                const drinkData = await getDrinks();
                const foundDrink = drinkData.find((item) => String(item.id) === id);
                if (!foundDrink) {
                    toast.error("Không tìm thấy món ăn!");
                    navigate("/drink");
                    return;
                }
                setDrink(foundDrink);

                // Lấy danh sách loại sản phẩm
                const categoryData = await getCategories();
                setCategories(categoryData);
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("Lỗi khi tải dữ liệu!");
            }
        };

        fetchData();
    }, [id, navigate]);

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleUpdate = async () => {
        setUpdating(true);
        try {
            let updatedDrink = { ...drink };
            if (imageFile) {
                const publicId = await uploadImageToCloudinary(imageFile);
                updatedDrink.imgDrinks = publicId;
            }
            await updateDrink(updatedDrink);
            toast.success("Cập nhật món ăn thành công!");
            setTimeout(() => {
                navigate("/admin/menu");
            }, 1000);
        } catch (error) {
            console.error("Error updating drink:", error);
            toast.error("Lỗi khi cập nhật món ăn!");
        } finally {
            setUpdating(false);
        }
    };

    if (!drink) {
        return (
            <Container>
                <Typography variant="h6">Đang tải dữ liệu...</Typography>
            </Container>
        );
    }

    return (
        <>
            <Helmet>
                <title>Chỉnh sửa món ăn</title>
            </Helmet>
            <HeaderAdmin />
            <ToastContainer position="top-right" autoClose={3000} />
            <Box
                sx={{
                    pt: 10,
                    pb: 1, // giảm padding dưới để tránh khoảng trắng thừa
                    minHeight: "calc(100vh - 100px)", // điều chỉnh minHeight nếu cần
                    backgroundColor: "#f5f5f5",
                }}
            >
                <Container maxWidth="sm">
                    <Paper
                        elevation={3}
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            border: `1px solid ${primaryColor}`,
                        }}
                    >
                        <Typography
                            variant="h5"
                            gutterBottom
                            sx={{
                                color: primaryColor,
                                fontWeight: "bold",
                                textAlign: "center",
                                mb: 2,
                            }}
                        >
                            Chỉnh Sửa Món Ăn
                        </Typography>
                        <Box component="form" noValidate autoComplete="off">
                            <Typography variant="body1" sx={{ mb: 1, color: primaryColor }}>
                                Ảnh hiện tại:
                            </Typography>
                            <CardMedia
                                component="img"
                                image={getCloudinaryImageUrl(drink.imgDrinks)}
                                alt={drink.nameDrinks}
                                sx={{
                                    width: 150,
                                    height: 150,
                                    objectFit: "cover",
                                    borderRadius: "8px",
                                    border: `1px solid ${primaryColor}`,
                                    mb: 2,
                                }}
                            />
                            <TextField
                                label="Tên Món"
                                fullWidth
                                value={drink.nameDrinks}
                                onChange={(e) =>
                                    setDrink({ ...drink, nameDrinks: e.target.value })
                                }
                                sx={{ mb: 2 }}
                                InputLabelProps={{ shrink: true }}
                            />
                            <NumericFormat
                                customInput={TextField}
                                label="Giá"
                                fullWidth
                                value={drink.price}
                                thousandSeparator="."
                                decimalSeparator=","
                                onValueChange={(values) =>
                                    setDrink({ ...drink, price: values.value })
                                }
                                sx={{ mb: 2 }}
                                InputLabelProps={{ shrink: true }}
                            />
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel>Loại Sản Phẩm</InputLabel>
                                <Select
                                    value={drink.category ? drink.category.nameCategory : ""}
                                    onChange={(e) => {
                                        const selectedCat = categories.find(
                                            (cat) => cat.nameCategory === e.target.value
                                        );
                                        setDrink({ ...drink, category: selectedCat });
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
                                <>
                                    <Typography variant="body1" sx={{ mb: 1, color: primaryColor }}>
                                        Ảnh mới:
                                    </Typography>
                                    <CardMedia
                                        component="img"
                                        image={URL.createObjectURL(imageFile)}
                                        alt="New Preview"
                                        sx={{
                                            width: 150,
                                            height: 150,
                                            objectFit: "cover",
                                            borderRadius: "8px",
                                            border: `1px solid ${primaryColor}`,
                                            mb: 2,
                                        }}
                                    />
                                </>
                            )}
                            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    id="upload-image"
                                />
                                <label
                                    htmlFor="upload-image"
                                    style={{
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <PhotoCamera sx={{ color: primaryColor, mr: 1 }} />
                                    <Typography variant="subtitle1" sx={{ color: primaryColor }}>
                                        Tải ảnh mới
                                    </Typography>
                                </label>
                            </Box>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        onClick={handleUpdate}
                                        disabled={updating}
                                        sx={{
                                            backgroundColor: primaryColor,
                                            color: "#fff",
                                            "&:hover": { backgroundColor: "#d1a750" },
                                            py: 1.5,
                                        }}
                                    >
                                        {updating ? "Đang cập nhật..." : "Cập Nhật"}
                                    </Button>
                                </Grid>
                                <Grid item xs={6}>
                                    <Button
                                        variant="outlined"
                                        fullWidth
                                        onClick={() => navigate("/admin/menu")}
                                        sx={{
                                            borderColor: primaryColor,
                                            color: primaryColor,
                                            py: 1.5,
                                        }}
                                    >
                                        Hủy
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Paper>
                </Container>
            </Box>
        </>
    );
};

export default EditDrinkPage;
