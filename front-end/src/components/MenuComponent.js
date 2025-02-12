import { useEffect, useState } from "react";
import { getCategories } from "../service/CategoryService";
import { getDrinks, getDrinksByCategory } from "../service/DrinkService";
import { getCloudinaryImageUrl } from "../service/CloudinaryService";
import {
    AppBar,
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Grid,
    Stack,
    Toolbar,
    Typography,
} from "@mui/material";

const MenuComponent = () => {
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);
    const [drinks, setDrinks] = useState([]);
    const [visibleCount, setVisibleCount] = useState(4);

    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getCategories();
                const categoriesWithAll = [{ id: "all", nameCategory: "Tất Cả" }, ...response];
                setCategories(categoriesWithAll);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        if (categories.length > 0 && !activeCategory) {
            setActiveCategory(categories[0]);
        }
    }, [categories, activeCategory]);

    // Khi danh mục thay đổi, reset số lượng đồ uống hiển thị về 4
    useEffect(() => {
        setVisibleCount(4);
        const fetchDrinks = async () => {
            if (activeCategory) {
                try {
                    if (activeCategory.nameCategory === "Tất Cả") {
                        // Lấy tất cả đồ uống
                        const allDrinks = await getDrinks();
                        setDrinks(allDrinks);
                    } else {
                        // Lấy đồ uống theo danh mục
                        const drinksData = await getDrinksByCategory(activeCategory.id);
                        setDrinks(drinksData);
                    }
                } catch (error) {
                    console.error("Error fetching drinks:", error);
                }
            }
        };

        fetchDrinks();
    }, [activeCategory]);

    const handleLoadMore = () => {
        setVisibleCount((prev) => prev + 4);
    };

    return (
        <Box
            sx={{
                backgroundColor: "#f3f4f6",
                minHeight: "100vh",
                fontFamily: "sans-serif",
            }}
        >
            <AppBar
                position="static"
                elevation={3}
                sx={{ backgroundColor: "#fff", color: "#000" }}
            >
                <Toolbar sx={{ px: { xs: 2, sm: 3 } }}>
                    <Container maxWidth="md">
                        <Typography
                            variant="h4"
                            component="h1"
                            align="center"
                            sx={{
                                fontWeight: "bold",
                                flexGrow: 1,
                                fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
                            }}
                        >
                            Menu
                        </Typography>
                    </Container>
                </Toolbar>
            </AppBar>
            <Box
                sx={{
                    position: "sticky",
                    top: 0,
                    zIndex: 50,
                    mb: { xs: 3, sm: 6 },
                    backgroundColor: "#fff",
                    pt: { xs: 2, sm: 3 },
                    pb: { xs: 2, sm: 3 },
                    px: { xs: 2, sm: 3 },
                }}
            >
                <Container maxWidth="md">
                    <Typography
                        variant="h6"
                        component="h2"
                        sx={{
                            mb: { xs: 1, sm: 2 },
                            fontWeight: 600,
                            fontSize: { xs: "1.1rem", sm: "1.25rem" },
                            textAlign: "left",
                        }}
                    >
                        Chọn Danh Mục
                    </Typography>
                    <Stack
                        direction="row"
                        spacing={{ xs: 1, sm: 2 }}
                        sx={{
                            overflowX: "auto",
                            "&::-webkit-scrollbar": { display: "none" },
                        }}
                    >
                        {categories.map((category, index) => {
                            const isActive =
                                activeCategory?.id === category.id || (!activeCategory && index === 0);
                            return (
                                <Button
                                    key={category.id}
                                    onClick={() => setActiveCategory(category)}
                                    sx={{
                                        borderRadius: "50px",
                                        textTransform: "none",
                                        whiteSpace: "nowrap",
                                        px: { xs: 1, sm: 1.5 },
                                        py: { xs: 0.5, sm: 1 },
                                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
                                        backgroundColor: isActive ? "#E7B45A" : "rgba(231,180,90,0.3)",
                                        color: isActive ? "#fff" : "#E7B45A",
                                        boxShadow: "none",
                                        "&:hover": {
                                            backgroundColor: isActive ? "#d6a24e" : "rgba(231,180,90,0.5)",
                                        },
                                    }}
                                >
                                    {category.nameCategory}
                                </Button>
                            );
                        })}
                    </Stack>
                </Container>
            </Box>

            {activeCategory && (
                <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 6 } }}>
                    <Typography variant="h5" sx={{ mb: { xs: 2, sm: 4 }, fontWeight: 600 }}>
                        Danh Sách Đồ Uống
                    </Typography>
                    {drinks.length > 0 ? (
                        <>
                            <Grid container spacing={2}>
                                {drinks.slice(0, visibleCount).map((drink) => (
                                    <Grid item key={drink.id} xs={6} sm={6} md={4} lg={3}>
                                        <Card>
                                            <CardContent sx={{ p: { xs: 1, sm: 2 } }}>
                                                <img
                                                    src={getCloudinaryImageUrl(drink.imgDrinks, {
                                                        width: 300,
                                                        height: 300,
                                                        crop: "fill",
                                                    })}
                                                    alt={drink.nameDrinks}
                                                    style={{
                                                        width: "100%",
                                                        height: "auto",
                                                        marginBottom: "8px",
                                                    }}
                                                />
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        fontWeight: "bold",
                                                        fontSize: { xs: "0.875rem", sm: "1rem" },
                                                    }}
                                                >
                                                    {drink.nameDrinks}
                                                </Typography>
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
                                                    }}
                                                >
                                                    {formatPrice(drink.price)}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                            {/* Nút Load More được căn chỉnh cho mobile-first */}
                            {visibleCount < drinks.length && (
                                <Box
                                    sx={{
                                        mt: { xs: 2, sm: 4 },
                                        display: "flex",
                                        justifyContent: "center",
                                        px: { xs: 2, sm: 0 },
                                    }}
                                >
                                    <Button
                                        variant="contained"
                                        onClick={handleLoadMore}
                                        sx={{
                                            width: { xs: "100%", sm: "auto" },
                                            px: { xs: 2, sm: 3 },
                                            py: { xs: 1, sm: 1.5 },
                                            fontSize: { xs: "0.875rem", sm: "1rem" },
                                            backgroundColor: "#E7B45A",
                                            color: "#fff",
                                            borderRadius: "8px",
                                            boxShadow: "none",
                                            "&:hover": { backgroundColor: "#d6a24e" },
                                        }}
                                    >
                                        Load More
                                    </Button>
                                </Box>
                            )}
                        </>
                    ) : (
                        <Typography variant="body1">
                            Không có đồ uống cho danh mục này.
                        </Typography>
                    )}
                </Container>
            )}
        </Box>
    );
};

export default MenuComponent;
